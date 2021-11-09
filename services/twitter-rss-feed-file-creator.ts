import { Feed } from "feed";
import { promises as fs } from "fs";

import * as VO from "../value-objects";
import * as Services from "../services";

type TwitterRssFeedFileContent = ReturnType<Feed["rss2"]>;

export class TwitterRssFeedFileCreator {
  locations: Services.TwitterRssFeedLocationsType;

  feed: VO.TwitterRssFeedType;

  constructor(feed: VO.TwitterRssFeedType) {
    this.feed = feed;
    this.locations = Services.TwitterRssFeedLocationsGenerator.generate(
      feed.twitterUserId
    );
  }

  async build(): Promise<TwitterRssFeedFileContent> {
    const settings: Services.TweetFiltersSettings = {
      skipReplyTweets: this.feed.skipReplyTweets,
    };

    const tweets = await Services.TwitterApi.getTweetsFromUser(
      this.feed.twitterUserName
    );

    const filteredTweets = tweets.filter(
      Services.TweetFilters.passesAllFilters(settings)
    );

    const rss = new Feed({
      title: this.feed.twitterUserName,
      description: this.feed.twitterUserDescription,
      id: String(this.feed.twitterUserId),
      link: this.locations.link,
      image: this.feed.twitterUserThumbnail,
      favicon: this.feed.twitterUserThumbnail,
      copyright: "All rights reserved",
    });

    for (const tweet of filteredTweets) {
      rss.addItem({
        id: tweet.id,
        title: tweet.text,
        link: `https://twitter.com/${this.feed.twitterUserName}/status/${tweet.id}`,
        date: new Date(tweet.createdAt),
      });
    }

    return rss.rss2();
  }

  async save(content: TwitterRssFeedFileContent) {
    try {
      await fs.writeFile(this.locations.path, content);
      /* eslint-disable no-empty */
    } catch (error) {}
  }

  static async delete(locations: Services.TwitterRssFeedLocationsType) {
    try {
      await fs.unlink(locations.path);
      /* eslint-disable no-empty */
    } catch (error) {}
  }
}
