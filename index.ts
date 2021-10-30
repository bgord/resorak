import express from "express";
import { flash } from "express-flash-message";

import * as bg from "@bgord/node";

import { Env } from "./env";
import { Scheduler } from "./jobs";
import { ErrorHandler } from "./error-handler";

import { Home } from "./routes/home";
import { CreateTwitterRss } from "./routes/create-twitter-rss";
import { DeleteTwitterRss } from "./routes/delete-twitter-rss";

import {
  TwitterUserDoesNotExistsError,
  TwitterRssFeedAlreadyExistsError,
} from "./aggregates/twitter-rss-feed";

const app = express();

const sentry = new bg.Sentry({
  dsn: Env.SENTRY_DSN,
  enabled: true,
});
sentry.applyTo(app);

bg.addExpressEssentials(app, {
  helmet: bg.deepMerge(bg.helmetScriptsCspConfig, bg.helmetStylesCspConfig),
});
new bg.Handlebars().applyTo(app);
new bg.Session({ secret: Env.COOKIE_SECRET }).applyTo(app);

app.use(flash({ sessionKeyName: "flashMessage" }));

app.get("/", bg.CsrfShield.attach, Home);
app.post(
  "/create-rss",
  bg.CsrfShield.verify,
  bg.ApiKeyShield.build(Env.API_KEY),
  bg.Route(CreateTwitterRss)
);
app.delete(
  "/delete-rss/:id",
  bg.CsrfShield.verify,
  bg.ApiKeyShield.build(Env.API_KEY),
  bg.Route(DeleteTwitterRss)
);

sentry.report(app, [
  bg.Errors.AccessDeniedError,
  TwitterUserDoesNotExistsError,
  TwitterRssFeedAlreadyExistsError,
]);

app.use(ErrorHandler.handle);

const server = app.listen(Env.PORT, () =>
  bg.Reporter.info(`Server running on port: ${Env.PORT}`)
);

bg.GracefulShutdown.applyTo(server, () => {
  bg.Reporter.info("Shutting down job scheduler");
  Scheduler.stop();
});
