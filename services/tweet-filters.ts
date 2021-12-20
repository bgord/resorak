import * as VO from "../value-objects";

export type TweetFiltersSettings = {
  skipReplyTweets: VO.TwitterRssFeedType["skipReplyTweets"];
  phrasesToFilterOut: VO.PhraseToFilterOutType[];
};

export class TweetFilters {
  static passesAllFilters(settings: TweetFiltersSettings) {
    const filters = [
      settings.skipReplyTweets
        ? TweetFilters.skipReplyTweetsFilter
        : TweetFilters._passthrough,

      settings.phrasesToFilterOut.length > 0
        ? TweetFilters.skipPhrasesFilter
        : TweetFilters._passthrough,
    ];

    return function (tweet: VO.TweetType): boolean {
      return filters.every((filter) => filter(tweet, settings) === true);
    };
  }

  private static skipReplyTweetsFilter(tweet: VO.TweetType): boolean {
    return tweet.isReplyTweet === false;
  }

  private static skipPhrasesFilter(
    tweet: VO.TweetType,
    settings: TweetFiltersSettings
  ): boolean {
    return settings.phrasesToFilterOut.every(
      (phrase) => !tweet.text.toLowerCase().includes(phrase.content)
    );
  }

  private static _passthrough(): true {
    return true;
  }
}
