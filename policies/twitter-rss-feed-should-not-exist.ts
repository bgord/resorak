import * as VO from "../value-objects";

export class TwitterRssFeedShouldNotExist {
  static fails(
    feeds: VO.TwitterRssFeedType[],
    twitterUserName: VO.TwitterUserNameType
  ): boolean {
    return feeds.some((feed) => feed.twitterUserName === twitterUserName);
  }
}
