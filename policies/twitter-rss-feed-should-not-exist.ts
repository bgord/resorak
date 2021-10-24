import { TwitterHandleType } from "../value-objects/twitter-handle";
import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";

export class TwitterRssFeedShouldNotExistPolicy {
  static fails(
    feeds: TwitterRssFeedType[],
    twitterHandle: TwitterHandleType
  ): boolean {
    return feeds.some((feed) => feed.twitterUserName === twitterHandle);
  }
}
