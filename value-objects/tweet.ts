import { z } from "zod";

export const Tweet = z.object({
  id: z.string().nonempty(),
  createdAt: z.string(),
  text: z.string(),
  isReplyTweet: z.boolean(),
});

export type TweetType = z.infer<typeof Tweet>;
