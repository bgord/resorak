import { z } from "zod";

import { TwitterUser } from "./twitter-user";

export const TwitterRssFeed = TwitterUser;

export type TwitterRssFeedType = z.infer<typeof TwitterRssFeed>;
