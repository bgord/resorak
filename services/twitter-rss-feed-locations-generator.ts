import { Env } from "../env";

import * as VO from "../value-objects";

export type TwitterRssFeedLocationsType = {
  filename: string;
  path: string;
  link: string;
};

export class TwitterRssFeedLocationsGenerator {
  static generate(
    twitterUserId: VO.TwitterRssFeedType["twitterUserId"]
  ): TwitterRssFeedLocationsType {
    const filename = `${twitterUserId}.rss`;

    return {
      filename,
      path: `static/${filename}`,
      link: `${Env.BASE_URL}/${filename}`,
    };
  }
}
