import * as VO from "../value-objects";

export class TwitterRssFeedShouldExist {
  static fails(
    feeds: VO.TwitterRssFeedType[],
    twitterUserId: VO.TwitterUserIdType
  ): boolean {
    return feeds.every((entry) => entry.twitterUserId !== twitterUserId);
  }
}
