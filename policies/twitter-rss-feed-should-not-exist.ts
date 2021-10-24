import { TwitterHandleType } from "../value-objects/twitter-handle";

export class TwitterRssFeedShouldNotExistPolicy {
  static fails(
    feeds: TwitterHandleType[],
    twitterHandle: TwitterHandleType
  ): boolean {
    return feeds.some((feed) => feed === twitterHandle);
  }
}
