import { z } from "zod";

import { TwitterRssFeedStatus } from "./twitter-rss-feed-status";
import { TwitterUser } from "./twitter-user";
import { TwitterRssFeedLastUpdatedAtTimestap } from "./twitter-rss-feed-last-updated-at";

export const TwitterRssFeed = TwitterUser.merge(
  z.object({
    lastUpdatedAtTimestamp: TwitterRssFeedLastUpdatedAtTimestap,
    skipReplyTweets: z.boolean().default(false),
    status: TwitterRssFeedStatus,
  })
);

export type TwitterRssFeedType = z.infer<typeof TwitterRssFeed>;
