import { EventRepository } from "../repositories/event-repository";

import { TwitterHandleType } from "../value-objects/twitter-handle";
import {
  CREATED_RSS_EVENT,
  CreatedRssEvent,
} from "../value-objects/created-rss-event";

import { TwitterRssFeedShouldNotExistPolicy } from "../policies/twitter-rss-feed-should-not-exist";

export class TwitterRssFeeds {
  private feeds: TwitterHandleType[] = [];

  async build() {
    const createdRssEvents = await new EventRepository().find(
      CREATED_RSS_EVENT
    );

    const feeds: TwitterHandleType[] = [];

    for (const event of createdRssEvents) {
      const { payload } = CreatedRssEvent.pick({ payload: true }).parse({
        payload: event.payload,
      });

      feeds.push(payload.twitterHandle);
    }

    this.feeds = feeds;

    return this;
  }

  getAll(): TwitterRssFeeds["feeds"] {
    return this.feeds;
  }

  async create(twitterHandle: TwitterHandleType) {
    if (TwitterRssFeedShouldNotExistPolicy.fails(this.feeds, twitterHandle)) {
      throw new Error();
    }

    const event = CreatedRssEvent.parse({
      name: CREATED_RSS_EVENT,
      version: 1,
      payload: { twitterHandle },
    });

    await new EventRepository().save(event);
  }
}
