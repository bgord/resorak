import _ from "lodash";
import { Feed } from "feed";

import {
  CREATED_RSS_EVENT,
  CreatedRssEvent,
} from "../value-objects/created-rss-event";
import {
  DELETED_RSS_EVENT,
  DeletedRssEvent,
} from "../value-objects/deleted-rss-event";
import { EventRepository } from "../repositories/event-repository";
import { TwitterApiService } from "../services/twitter-api";
import { TwitterUserNameType } from "../value-objects/twitter-user-name";
import { TwitterRssFeedShouldExistPolicy } from "../policies/twitter-rss-feed-should-exist";
import { TwitterRssFeedShouldNotExistPolicy } from "../policies/twitter-rss-feed-should-not-exist";
import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";
import { TwitterRssLocationGenerator } from "../services/twitter-rss-location-generator";
import { TwitterUserExistsPolicy } from "../policies/twitter-user-exists";
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
    if (TwitterRssFeedShouldNotExistPolicy.fails(this.list, twitterUserName)) {
      throw new TwitterRssFeedAlreadyExistsError();
    }

    const twitterUser = await TwitterApiService.getUser(twitterUserName);

    if (await TwitterUserExistsPolicy.fails(twitterUser)) {
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
    if (TwitterRssFeedShouldExistPolicy.fails(this.list, twitterUserId)) {
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

  async generateFeed(feed: TwitterRssFeedType): Promise<{
    location: ReturnType<typeof TwitterRssLocationGenerator.generate>;
    content: ReturnType<Feed["rss2"]>;
  }> {
    if (TwitterRssFeedShouldExistPolicy.fails(this.list, feed.twitterUserId)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    const tweets = await TwitterApiService.getTweetsFromUser(
      feed.twitterUserName
    );
    const location = TwitterRssLocationGenerator.generate(feed.twitterUserId);

    const rss = new Feed({
      title: feed.twitterUserName,
      description: feed.twitterUserDescription,
      id: String(feed.twitterUserId),
      link: location.link,
      copyright: "All rights reserved",
    });

    for (const tweet of tweets) {
      rss.addItem({
        id: tweet.id,
        title: tweet.text,
        link: `https://twitter.com/${feed.twitterUserName}/status/${tweet.id}`,
        date: new Date(tweet.createdAt),
      });
    }

    return { location, content: rss.rss2() };
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
