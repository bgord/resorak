import { z } from "zod";

export const TwitterRssFeedLastUpdatedAtTimestap = z
  .number()
  .positive()
  .or(z.null())
  .default(null);

export type TwitterRssFeedLastUpdatedAtTimestapType = z.infer<
  typeof TwitterRssFeedLastUpdatedAtTimestap
>;
