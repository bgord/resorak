import { z } from "zod";

export const FeedlyHitTimestamp = z.number().positive();

export type FeedlyHitTimestampType = z.infer<typeof FeedlyHitTimestamp>;
