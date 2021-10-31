import _ from "lodash";

import {
  CREATED_RSS_EVENT,
  CreatedRssEvent,
} from "../value-objects/created-rss-event";
import {
  DELETED_RSS_EVENT,
  DeletedRssEvent,
} from "../value-objects/deleted-rss-event";
import { EventRepository } from "../repositories/event-repository";
import { TwitterUserNameType } from "../value-objects/twitter-user-name";
import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";
import * as Policy from "../policies";
import * as Services from "../services";
import { emittery } from "../events";

export class TwitterRssFeed {
  private list: TwitterRssFeedType[] = [];

  async build() {
    const events = await new EventRepository().find([
      CreatedRssEvent,
      DeletedRssEvent,
    ]);

    const feeds = [];

    for (const event of events) {
      if (event.name === CREATED_RSS_EVENT) {
        feeds.push(event.payload);
      }
      if (event.name === DELETED_RSS_EVENT) {
        _.remove(
          feeds,
          (feed) => feed.twitterUserId === event.payload.twitterUserId
        );
      }
    }

    this.list = feeds;

    return this;
  }

  getAll(): TwitterRssFeed["list"] {
    return this.list;
  }

  async create(twitterUserName: TwitterUserNameType) {
    if (Policy.TwitterRssFeedShouldNotExist.fails(this.list, twitterUserName)) {
      throw new TwitterRssFeedAlreadyExistsError();
    }

    const twitterUser = await Services.TwitterApi.getUser(twitterUserName);

    if (await Policy.TwitterUserExists.fails(twitterUser)) {
      throw new TwitterUserDoesNotExistsError();
    }

    const createdRssEvent = CreatedRssEvent.parse({
      name: CREATED_RSS_EVENT,
      version: 1,
      payload: twitterUser,
    });
    await new EventRepository().save(createdRssEvent);
    emittery.emit(CREATED_RSS_EVENT, createdRssEvent);
  }

  async delete(twitterUserId: TwitterRssFeedType["twitterUserId"]) {
    if (Policy.TwitterRssFeedShouldExist.fails(this.list, twitterUserId)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    const deletedRssEvent = DeletedRssEvent.parse({
      name: DELETED_RSS_EVENT,
      version: 1,
      payload: { twitterUserId },
    });
    await new EventRepository().save(deletedRssEvent);
    emittery.emit(DELETED_RSS_EVENT, deletedRssEvent);
  }

  async generate(feed: TwitterRssFeedType) {
    if (Policy.TwitterRssFeedShouldExist.fails(this.list, feed.twitterUserId)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    const tweets = await Services.TwitterApi.getTweetsFromUser(
      feed.twitterUserName
    );
    const locations = Services.TwitterRssFeedLocationsGenerator.generate(
      feed.twitterUserId
    );

    const twitterRssFeedCreator = new Services.TwitterRssFeedFileCreator(
      locations
    );
    const twitterRssFeedContent = await twitterRssFeedCreator.build({
      tweets,
      feed,
    });
    await twitterRssFeedCreator.save(twitterRssFeedContent);
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
