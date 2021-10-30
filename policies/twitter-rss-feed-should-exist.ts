import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";

export class TwitterRssFeedShouldExist {
  static fails(
    feeds: TwitterRssFeedType[],
    twitterUserId: TwitterRssFeedType["twitterUserId"]
  ): boolean {
    return feeds.every((entry) => entry.twitterUserId !== twitterUserId);
  }
}
