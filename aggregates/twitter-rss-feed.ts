import _ from "lodash";

import * as VO from "../value-objects";
import * as Policy from "../policies";
import * as Services from "../services";
import * as Events from "../events";

import { EventRepository } from "../repositories/event-repository";

export class TwitterRssFeed {
  private list: VO.TwitterRssFeedType[] = [];

  async build() {
    const events = await new EventRepository().find([
      Events.CreatedRssEvent,
      Events.DeletedRssEvent,
      Events.UpdatedRssEvent,
    ]);

    const feeds: VO.TwitterRssFeedType[] = [];

    for (const event of events) {
      if (event.name === Events.CREATED_RSS_EVENT) {
        feeds.push({ ...event.payload, lastUpdatedAtTimestamp: null });
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
    }

    this.list = feeds;

    return this;
  }

  getAll(): TwitterRssFeed["list"] {
    return this.list;
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
    await new EventRepository().save(createdRssEvent);
    Events.emittery.emit(Events.CREATED_RSS_EVENT, createdRssEvent);
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
    await new EventRepository().save(deletedRssEvent);
    Events.emittery.emit(Events.DELETED_RSS_EVENT, deletedRssEvent);
  }

  async generate(feed: VO.TwitterRssFeedType) {
    if (Policy.TwitterRssFeedShouldExist.fails(this.list, feed.twitterUserId)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    const twitterRssFeedFileCreator = new Services.TwitterRssFeedFileCreator(
      feed
    );
    const twitterRssFeedContent = await twitterRssFeedFileCreator.build();
    await twitterRssFeedFileCreator.save(twitterRssFeedContent);
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
export class TwitterUserDoesNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TwitterUserDoesNotExistsError.prototype);
  }
}
