import { z } from "zod";

import { TwitterUserId } from "./twitter-user-id";
import { TwitterUserName } from "./twitter-user-name";
import { TwitterDescription } from "./twitter-description";

export const TwitterUser = z.object({
  twitterUserId: TwitterUserId,
  twitterUserName: TwitterUserName,
  twitterUserDescription: TwitterDescription,
});

export type TwitterUserType = z.infer<typeof TwitterUser>;
