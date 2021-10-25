import { z } from "zod";
import { Schema } from "@bgord/node";

export const TwitterRssRegenerationIntervalInMinutes =
  Schema.StringToNumber.refine((value) => value > 0, {
    message: "too_small_twitter_rss_regeneration_interval_in_minutes_number",
  });

export type TwitterRssRegenerationIntervalInMinutesType = z.infer<
  typeof TwitterRssRegenerationIntervalInMinutes
>;
