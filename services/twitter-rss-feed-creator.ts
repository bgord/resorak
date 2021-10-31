import { Feed } from "feed";
import { promises as fs } from "fs";

import { TweetType } from "../value-objects/tweet";
import { TwitterRssFeedType } from "../value-objects/twitter-rss-feed";

import * as Services from "../services";

export class TwitterRssFeedCreator {
  locations: Services.TwitterRssFeedLocationsType;

  constructor(locations: Services.TwitterRssFeedLocationsType) {
    this.locations = locations;
  }

  async build(data: {
    tweets: TweetType[];
    feed: TwitterRssFeedType;
  }): Promise<ReturnType<Feed["rss2"]>> {
    const rss = new Feed({
      title: data.feed.twitterUserName,
      description: data.feed.twitterUserDescription,
      id: String(data.feed.twitterUserId),
      link: this.locations.link,
      copyright: "All rights reserved",
    });

    for (const tweet of data.tweets) {
      rss.addItem({
        id: tweet.id,
        title: tweet.text,
        link: `https://twitter.com/$content.{feed.twitterUserName}/status/${tweet.id}`,
        date: new Date(tweet.createdAt),
      });
    }

    return rss.rss2();
  }

  async save(content: ReturnType<Feed["rss2"]>) {
    try {
      await fs.writeFile(this.locations.path, content);
    } catch (error) {}
  }

  static async delete(locations: Services.TwitterRssFeedLocationsType) {
    try {
      await fs.unlink(locations.path);
    } catch (error) {}
  }
}
