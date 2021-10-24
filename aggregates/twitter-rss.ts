import { EventRepository } from "../repositories/event-repository";
import { Twitter } from "../services/twitter";
import { TwitterHandleType } from "../value-objects/twitter-handle";
import {
  CREATED_RSS_EVENT,
  CreatedRssEvent,
} from "../value-objects/created-rss-event";

import { TwitterRssFeedShouldNotExistPolicy } from "../policies/twitter-rss-feed-should-not-exist";
import { TwitterUserExistsPolicy } from "../policies/twitter-user-exists";

export class TwitterRss {
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

      feeds.push(payload.name);
    }

    this.feeds = feeds;

    return this;
  }

  getFeeds(): TwitterRss["feeds"] {
    return this.feeds;
  }

  async createFeed(twitterHandle: TwitterHandleType) {
    if (TwitterRssFeedShouldNotExistPolicy.fails(this.feeds, twitterHandle)) {
      throw new Error();
    }

    const twitterUser = await Twitter.showUser(twitterHandle);

    if (await TwitterUserExistsPolicy.fails(twitterUser)) {
      throw new Error();
    }

    const createdRssEvent = CreatedRssEvent.parse({
      name: CREATED_RSS_EVENT,
      version: 1,
      payload: twitterUser,
    });

    await new EventRepository().save(createdRssEvent);
  }
}
