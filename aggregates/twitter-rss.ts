import { Feed } from "feed";
import { emittery } from "../events";

import { EventRepository } from "../repositories/event-repository";
import { TwitterService } from "../services/twitter";
import { TwitterRssLocationGenerator } from "../services/twitter-rss-location-generator";
import { TwitterHandleType } from "../value-objects/twitter-handle";
import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";
import {
  CREATED_RSS_EVENT,
  CreatedRssEvent,
} from "../value-objects/created-rss-event";

import { TwitterRssFeedShouldNotExistPolicy } from "../policies/twitter-rss-feed-should-not-exist";
import { TwitterRssFeedShouldExistPolicy } from "../policies/twitter-rss-feed-should-exist";
import { TwitterUserExistsPolicy } from "../policies/twitter-user-exists";

export class TwitterRss {
  private feeds: TwitterRssFeedType[] = [];

  async build() {
    const createdRssEvents = await new EventRepository().find(
      CREATED_RSS_EVENT
    );

    const feeds = [];

    for (const event of createdRssEvents) {
      const { payload } = CreatedRssEvent.pick({ payload: true }).parse({
        payload: event.payload,
      });

      feeds.push(payload);
    }

    this.feeds = feeds;

    return this;
  }

  getFeeds(): TwitterRss["feeds"] {
    return this.feeds;
  }

  async createFeed(twitterHandle: TwitterHandleType) {
    if (TwitterRssFeedShouldNotExistPolicy.fails(this.feeds, twitterHandle)) {
      throw new TwitterRssFeedAlreadyExistsError();
    }

    const twitterUser = await TwitterService.showUser(twitterHandle);

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

  async generateFeed(feed: TwitterRssFeedType): Promise<{
    location: ReturnType<typeof TwitterRssLocationGenerator.generate>;
    content: ReturnType<Feed["rss2"]>;
  }> {
    if (TwitterRssFeedShouldExistPolicy.fails(this.feeds, feed)) {
      throw new TwitterRssFeedDoesNotExistError();
    }

    const tweets = await TwitterService.getTweets(feed.twitterUserName);
    const location = TwitterRssLocationGenerator.generate(feed);

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

    return {
      location,
      content: rss.rss2(),
    };
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
