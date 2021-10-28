import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";

export class TwitterRssFeedShouldExistPolicy {
  static fails(
    feeds: TwitterRssFeedType[],
    twitterUserId: TwitterRssFeedType["twitterUserId"]
  ): boolean {
    return feeds.every((entry) => entry.twitterUserId !== twitterUserId);
  }
}
