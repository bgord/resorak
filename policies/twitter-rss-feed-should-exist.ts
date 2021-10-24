import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";

export class TwitterRssFeedShouldExistPolicy {
  static fails(feeds: TwitterRssFeedType[], feed: TwitterRssFeedType): boolean {
    return feeds.every(
      (entry) =>
        entry.twitterUserName !== feed.twitterUserName &&
        entry.twitterUserId !== feed.twitterUserId &&
        entry.twitterUserDescription !== feed.twitterUserDescription
    );
  }
}
