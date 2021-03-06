import { z } from "zod";
import { Schema, EnvironmentValidator } from "@bgord/node";

const EnvironmentSchema = z.object({
  PORT: Schema.Port,
  TWITTER_API_BEARER_TOKEN: Schema.TwitterApiBearerToken,
  TWITTER_RSS_REGENERATION_INTERVAL_IN_MINUTES: Schema.StringToNumber,
  BASE_URL: Schema.UrlWithoutTrailingSlash,
  COOKIE_SECRET: Schema.CookieSecret,
  SENTRY_DSN: Schema.SentryDsn,
  SUPPRESS_RSS_REGENERATION: Schema.FeatureFlag,
  ENABLE_SENTRY: Schema.FeatureFlag,
  ADMIN_USERNAME: Schema.AdminUsername,
  ADMIN_PASSWORD: Schema.AdminPassword,
  GITHUB_WEBHOOK_SECRET: Schema.ApiKey,
});
type EnvironmentSchemaType = z.infer<typeof EnvironmentSchema>;

export const Env = new EnvironmentValidator<EnvironmentSchemaType>({
  type: process.env.NODE_ENV,
  schema: EnvironmentSchema,
}).load();
