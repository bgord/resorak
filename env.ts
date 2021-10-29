import { z } from "zod";
import { Schema, EnvironmentValidator } from "@bgord/node";

const EnvironmentSchema = z.object({
  PORT: Schema.Port,
  TWITTER_BEARER_TOKEN: Schema.TwitterApiBearerToken,
  TWITTER_RSS_REGENERATION_INTERVAL_IN_MINUTES: Schema.StringToNumber,
  BASE_URL: Schema.UrlWithoutTrailingSlash,
  API_KEY: Schema.ApiKey,
  COOKIE_SECRET: Schema.CookieSecret,
  SENTRY_DSN: Schema.SentryDsn,
});
type EnvironmentSchemaType = z.infer<typeof EnvironmentSchema>;

export const Env = new EnvironmentValidator<EnvironmentSchemaType>({
  type: process.env.NODE_ENV,
  schema: EnvironmentSchema,
}).load();
