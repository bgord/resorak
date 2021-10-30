import { TwitterUserNameType } from "../value-objects/twitter-user-name";
import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";

export class TwitterRssFeedShouldNotExistPolicy {
  static fails(
    feeds: TwitterRssFeedType[],
    twitterUserName: TwitterUserNameType
  ): boolean {
    return feeds.some((feed) => feed.twitterUserName === twitterUserName);
  }
}
