import { z } from "zod";

import { Env } from "../env";

export const TwitterUserThumbnailPlaceholder = `${Env.BASE_URL}/twitter-user-thumbnail-placeholder.png`;

export const TwitterUserThumbnail = z
  .string()
  .url()
  .default(TwitterUserThumbnailPlaceholder);

export type TwitterUserThumbnailType = z.infer<typeof TwitterUserThumbnail>;
