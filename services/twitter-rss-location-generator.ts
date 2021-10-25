import { Env } from "../env";

import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";

export class TwitterRssLocationGenerator {
  static generate(feed: TwitterRssFeedType) {
    const filename = feed.twitterUserId;

    return {
      filename,
      path: `static/${filename}`,
      link: `${Env.BASE_URL}/${filename}`,
    };
  }
}
