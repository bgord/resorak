import { Env } from "../env";

import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";

export type TwitterRssFeedLocationsType = {
  filename: string;
  path: string;
  link: string;
};

export class TwitterRssFeedLocationsGenerator {
  static generate(
    twitterUserId: TwitterRssFeedType["twitterUserId"]
  ): TwitterRssFeedLocationsType {
    const filename = `${twitterUserId}.rss`;

    return {
      filename,
      path: `static/${filename}`,
      link: `${Env.BASE_URL}/${filename}`,
    };
  }
}
