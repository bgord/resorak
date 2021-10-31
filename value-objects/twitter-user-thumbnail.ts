import { z } from "zod";

export const TwitterUserThumbnail = z
  .string()
  .url()
  .default("https://via.placeholder.com/48x48.webp/333333?text=T");

export type TwitterUserThumbnailType = z.infer<typeof TwitterUserThumbnail>;
