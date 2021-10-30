import { z } from "zod";

import { TwitterId } from "./twitter-id";
import { TwitterUserName } from "./twitter-user-name";
import { TwitterDescription } from "./twitter-description";

export const TwitterUser = z.object({
  twitterUserId: TwitterId,
  twitterUserName: TwitterUserName,
  twitterUserDescription: TwitterDescription,
});

export type TwitterUserType = z.infer<typeof TwitterUser>;
