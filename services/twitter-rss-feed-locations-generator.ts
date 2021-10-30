import { Env } from "../env";

import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";

export class TwitterRssFeedLocationsGenerator {
  static generate(twitterUserId: TwitterRssFeedType["twitterUserId"]) {
    const filename = `${twitterUserId}.rss`;

    return {
      filename,
      path: `static/${filename}`,
      link: `${Env.BASE_URL}/${filename}`,
    };
  }
}
