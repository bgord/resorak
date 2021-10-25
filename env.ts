import { z } from "zod";
import { Schema, EnvironmentValidator } from "@bgord/node";

import { TwitterBearerToken } from "./value-objects/twitter-bearer-token";

const EnvironmentSchema = z.object({
  PORT: Schema.Port,
  TWITTER_BEARER_TOKEN: TwitterBearerToken,
  TWITTER_RSS_REGENERATION_INTERVAL_IN_MINUTES: Schema.StringToNumber,
});
type EnvironmentSchemaType = z.infer<typeof EnvironmentSchema>;

export const Env = new EnvironmentValidator<EnvironmentSchemaType>({
  type: process.env.NODE_ENV,
  schema: EnvironmentSchema,
}).load();
