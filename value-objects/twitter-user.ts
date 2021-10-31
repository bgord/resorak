import { z } from "zod";

import { TwitterUserId } from "./twitter-user-id";
import { TwitterUserName } from "./twitter-user-name";
import { TwitterUserDescription } from "./twitter-user-description";
import { TwitterUserThumbnail } from "./twitter-user-thumbnail";

export const TwitterUser = z.object({
  twitterUserId: TwitterUserId,
  twitterUserName: TwitterUserName,
  twitterUserDescription: TwitterUserDescription,
  twitterUserThumbnail: TwitterUserThumbnail,
});

export type TwitterUserType = z.infer<typeof TwitterUser>;
