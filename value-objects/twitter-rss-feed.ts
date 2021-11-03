import { z } from "zod";

import { TwitterUser } from "./twitter-user";
import { TwitterRssFeedLastUpdatedAtTimestap } from "./twitter-rss-feed-last-updated-at";

export const TwitterRssFeed = TwitterUser.merge(
  z.object({ lastUpdatedAtTimestamp: TwitterRssFeedLastUpdatedAtTimestap })
);

export type TwitterRssFeedType = z.infer<typeof TwitterRssFeed>;
