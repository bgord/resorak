import * as VO from "../value-objects";

export type TweetFiltersSettings = {
  skipReplyTweets: VO.TwitterRssFeedType["skipReplyTweets"];
};

export class TweetFilters {
  static passesAllFilters(settings: TweetFiltersSettings) {
    const filters = [
      settings.skipReplyTweets
        ? TweetFilters.skipReplyTweetsFilter
        : TweetFilters._passthrough,
    ];

    return function (tweet: VO.TweetType): boolean {
      return filters.every((filter) => filter(tweet) === true);
    };
  }

  private static skipReplyTweetsFilter(tweet: VO.TweetType): boolean {
    return tweet.isReplyTweet === false;
  }

  private static _passthrough(): true {
    return true;
  }
}
