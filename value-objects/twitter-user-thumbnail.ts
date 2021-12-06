import { z } from "zod";

export const TwitterUserThumbnailPlaceholder = `/twitter-user-thumbnail-placeholder.png`;

export const TwitterUserThumbnail = z
  .string()
  .url()
  .default(TwitterUserThumbnailPlaceholder);

export type TwitterUserThumbnailType = z.infer<typeof TwitterUserThumbnail>;
