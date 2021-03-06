import _ from "lodash";

import * as VO from "../value-objects";
import * as Policy from "../policies";
import * as Services from "../services";
import * as Events from "../events";

import { EventRepository } from "../repositories/event-repository";

export class TwitterRssFeed {
  private list: VO.TwitterRssFeedType[] = [];

  async build() {
    const events = await EventRepository.find([
      Events.CreatedRssEvent,
      Events.DeletedRssEvent,
      Events.UpdatedRssEvent,
      Events.SkipReplyTweetsInRssEvent,
      Events.IncludeReplyTweetsInRssEvent,
      Events.SuspendedRssEvent,
      Events.ActivatedRssEvent,
    ]);

    const feeds: VO.TwitterRssFeedType[] = [];

    for (const event of events) {
      if (event.name === Events.CREATED_RSS_EVENT) {
        feeds.push({
          ...event.payload,
          lastUpdatedAtTimestamp: null,
          skipReplyTweets: false,
          status: VO.TwitterRssFeedStatusEnum.active,
        });
      }

      if (event.name === Events.DELETED_RSS_EVENT) {
        _.remove(
          feeds,
          (feed) => feed.twitterUserId === event.payload.twitterUserId
        );
      }

      if (event.name === Events.UPDATED_RSS_EVENT) {
        for (const feed of feeds) {
          if (event.payload.ids.includes(feed.twitterUserId)) {
            feed.lastUpdatedAtTimestamp = event.payload.lastUpdatedAtTimestamp;
          }
        }
      }

      if (event.name === Events.SUSPENDED_RSS_EVENT) {
        for (const feed of feeds) {
          if (event.payload.id === feed.twitterUserId) {
            feed.status = VO.TwitterRssFeedStatusEnum.suspended;
          }
        }
      }

      if (event.name === Events.ACTIVATED_RSS_EVENT) {
        for (const feed of feeds) {
          if (event.payload.id === feed.twitterUserId) {
            feed.status = VO.TwitterRssFeedStatusEnum.active;
          }
        }
      }

      if (event.name === Events.SKIP_REPLY_TWEETS_IN_RSS_EVENT) {
        for (const feed of feeds) {
          if (feed.twitterUserId === event.payload.id) {
            feed.skipReplyTweets = true;
          }
        }
      }

      if (event.name === Events.INCLUDE_REPLY_TWEETS_IN_RSS_EVENT) {
        for (const feed of feeds) {
          if (feed.twitterUserId === event.payload.id) {
            feed.skipReplyTweets = false;
          }
        }
      }
    }

    this.list = feeds;

    return this;
  }

  getAll(): TwitterRssFeed["list"] {
    return this.list;
  }

  getActive() {
    return this.list.filter(
      (item) => item.status === VO.TwitterRssFeedStatusEnum.active
    );
  }

  async create(twitterUserName: VO.TwitterUserNameType) {
    if (Policy.TwitterRssFeedShouldNotExist.fails(this.list, twitterUserName)) {
      throw new TwitterRssFeedAlreadyExistsError();
    }

    const twitterUser = await Services.TwitterApi.getUser(twitterUserName);

    if (await Policy.TwitterUserExists.fails(twitterUser)) {
      throw new TwitterUserDoesNotExistsError();
    }

    const createdRssEvent = Events.CreatedRssEvent.parse({
      name: Events.CREATED_RSS_EVENT,
      version: 1,
      payload: twitterUser,
    });
    await EventRepository.save(createdRssEvent);
  }

  async delete(twitterUserId: VO.TwitterRssFeedType["twitterUserId"]) {
    if (Policy.TwitterRssFeedShouldExist.fails(this.list, twitterUserId)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    const deletedRssEvent = Events.DeletedRssEvent.parse({
      name: Events.DELETED_RSS_EVENT,
      version: 1,
      payload: { twitterUserId },
    });
    await EventRepository.save(deletedRssEvent);
  }

  async generate(feed: VO.TwitterRssFeedType) {
    if (Policy.TwitterRssFeedShouldExist.fails(this.list, feed.twitterUserId)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    if (
      Policy.TwitterRssFeedStatus.fails(
        VO.TwitterRssFeedStatusEnum.active,
        feed.status
      )
    ) {
      throw new TwitterRssFeedStatusError();
    }

    const twitterRssFeedFileCreator = new Services.TwitterRssFeedFileCreator(
      feed
    );
    const twitterRssFeedContent = await twitterRssFeedFileCreator.build();
    await twitterRssFeedFileCreator.save(twitterRssFeedContent);
  }

  async regenerate(id: VO.TwitterUserIdType) {
    if (Policy.TwitterRssFeedShouldExist.fails(this.list, id)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    const feed = this.list.find(
      (a) => a.twitterUserId === id
    ) as VO.TwitterRssFeedType;

    if (
      Policy.TwitterRssFeedStatus.fails(
        VO.TwitterRssFeedStatusEnum.active,
        feed.status
      )
    ) {
      throw new TwitterRssFeedStatusError();
    }

    const regeneratedRssEvent = Events.RegeneratedRssEvent.parse({
      name: Events.REGENERATED_RSS_EVENT,
      version: 1,
      payload: [feed],
    });
    await EventRepository.save(regeneratedRssEvent);
  }

  async suspend(id: VO.TwitterRssFeedType["twitterUserId"]) {
    if (Policy.TwitterRssFeedShouldExist.fails(this.list, id)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    const feed = this.list.find(
      (a) => a.twitterUserId === id
    ) as VO.TwitterRssFeedType;

    if (
      Policy.TwitterRssFeedStatusTransition.fails(
        feed.status,
        VO.TwitterRssFeedStatusEnum.suspended
      )
    ) {
      throw new TwitterRssFeedStatusTransitionError();
    }

    const suspendedRssEvent = Events.SuspendedRssEvent.parse({
      name: Events.SUSPENDED_RSS_EVENT,
      version: 1,
      payload: { id },
    });
    await EventRepository.save(suspendedRssEvent);
  }

  async activate(id: VO.TwitterRssFeedType["twitterUserId"]) {
    if (Policy.TwitterRssFeedShouldExist.fails(this.list, id)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    const feed = this.list.find(
      (a) => a.twitterUserId === id
    ) as VO.TwitterRssFeedType;

    if (
      Policy.TwitterRssFeedStatusTransition.fails(
        feed.status,
        VO.TwitterRssFeedStatusEnum.active
      )
    ) {
      throw new TwitterRssFeedStatusTransitionError();
    }

    const activatedRssEvent = Events.ActivatedRssEvent.parse({
      name: Events.ACTIVATED_RSS_EVENT,
      version: 1,
      payload: { id },
    });
    await EventRepository.save(activatedRssEvent);
  }

  async skipReplyTweets(id: VO.TwitterUserIdType) {
    if (Policy.TwitterRssFeedShouldExist.fails(this.list, id)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    const feed = this.list.find(
      (a) => a.twitterUserId === id
    ) as VO.TwitterRssFeedType;

    if (
      Policy.TwitterRssFeedFilterTransition.fails(feed.skipReplyTweets, true)
    ) {
      throw new TwitterRssFeedFilterTransitionError();
    }

    const regeneratedRssEvent = Events.SkipReplyTweetsInRssEvent.parse({
      name: Events.SKIP_REPLY_TWEETS_IN_RSS_EVENT,
      version: 1,
      payload: { id },
    });

    await EventRepository.save(regeneratedRssEvent);
  }

  async includeReplyTweets(id: VO.TwitterUserIdType) {
    if (Policy.TwitterRssFeedShouldExist.fails(this.list, id)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    const feed = this.list.find(
      (a) => a.twitterUserId === id
    ) as VO.TwitterRssFeedType;

    if (
      Policy.TwitterRssFeedFilterTransition.fails(feed.skipReplyTweets, false)
    ) {
      throw new TwitterRssFeedFilterTransitionError();
    }

    const includeReplyTweetsInRssEvent =
      Events.IncludeReplyTweetsInRssEvent.parse({
        name: Events.INCLUDE_REPLY_TWEETS_IN_RSS_EVENT,
        version: 1,
        payload: { id },
      });
    await EventRepository.save(includeReplyTweetsInRssEvent);
  }
}

export class TwitterRssFeedAlreadyExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TwitterRssFeedAlreadyExistsError.prototype);
  }
}
export class TwitterRssFeedDoesNotExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TwitterRssFeedDoesNotExistError.prototype);
  }
}
export class TwitterRssFeedFilterTransitionError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TwitterRssFeedFilterTransitionError.prototype);
  }
}

export class TwitterUserDoesNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TwitterUserDoesNotExistsError.prototype);
  }
}

export class TwitterRssFeedStatusTransitionError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TwitterRssFeedStatusTransitionError.prototype);
  }
}

export class TwitterRssFeedStatusError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TwitterRssFeedStatusError.prototype);
  }
}
