import { z } from "zod";

import { TwitterId } from "./twitter-id";
import { TwitterHandle } from "./twitter-handle";
import { TwitterDescription } from "./twitter-description";

export const TwitterUser = z.object({
  twitterUserId: TwitterId,
  twitterUserName: TwitterHandle,
  twitterUserDescription: TwitterDescription,
});

export type TwitterUserType = z.infer<typeof TwitterUser>;
