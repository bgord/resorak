import { z } from "zod";

import { TwitterId } from "./twitter-id";
import { TwitterHandle } from "./twitter-handle";

export const TwitterUser = z.object({
  twitterUserId: TwitterId,
  twitterUserName: TwitterHandle,
});

export type TwitterUserType = z.infer<typeof TwitterUser>;
