import { EventRepository } from "../repositories/event-repository";

import { TwitterHandleType } from "../value-objects/twitter-handle";
import {
  CREATED_RSS_EVENT,
  CreatedRssEvent,
} from "../value-objects/created-rss-event";

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
}

class TwitterRssFeedShouldNotExistPolicy {
  static fails(
    feeds: TwitterHandleType[],
    twitterHandle: TwitterHandleType
  ): boolean {
    return feeds.some((feed) => feed === twitterHandle);
  }
}
