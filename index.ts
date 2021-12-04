import express from "express";
import { flash } from "express-flash-message";

import * as bg from "@bgord/node";

import { Env } from "./env";
import { Scheduler } from "./jobs";
import { ErrorHandler } from "./error-handler";

import { Home } from "./routes/home";
import { CreateTwitterRss } from "./routes/create-twitter-rss";
import { DeleteTwitterRss } from "./routes/delete-twitter-rss";
import { RegenerateTwitterRss } from "./routes/regenerate-twitter-rss";
import { SkipReplyTweetsInRss } from "./routes/skip-reply-tweets-in-rss";
import { IncludeReplyTweetsInRss } from "./routes/include-reply-tweets-in-rss";
import { SuspendTwitterRss } from "./routes/suspend-twitter-rss";
import { ActivateTwitterRss } from "./routes/activate-twitter-rss";
import { AddPhraseToFilterOut } from "./routes/add-phrase-to-filter-out";

import {
  TwitterUserDoesNotExistsError,
  TwitterRssFeedAlreadyExistsError,
  TwitterRssFeedFilterTransitionError,
} from "./aggregates/twitter-rss-feed";
import { FeedlyHitLogger } from "./middlewares/feedly-hit-logger";

const app = express();

const sentry = new bg.Sentry({
  dsn: Env.SENTRY_DSN,
  enabled: Env.ENABLE_SENTRY === "yes",
});
sentry.applyTo(app);

bg.addExpressEssentials(app, {
  helmet: {
    contentSecurityPolicy: false,
  },
});
new bg.Handlebars().applyTo(app);
new bg.Session({ secret: Env.COOKIE_SECRET }).applyTo(app);

app.use(flash({ sessionKeyName: "flashMessage" }));

app.use(FeedlyHitLogger.handle());

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
app.post(
  "/regenerate-rss/:id",
  bg.CsrfShield.verify,
  bg.ApiKeyShield.build(Env.API_KEY),
  bg.Route(RegenerateTwitterRss)
);

app.post(
  "/skip-reply-tweets-in-rss/:id",
  bg.CsrfShield.verify,
  bg.ApiKeyShield.build(Env.API_KEY),
  bg.Route(SkipReplyTweetsInRss)
);

app.post(
  "/include-reply-tweets-in-rss/:id",
  bg.CsrfShield.verify,
  bg.ApiKeyShield.build(Env.API_KEY),
  bg.Route(IncludeReplyTweetsInRss)
);

app.post(
  "/suspend-rss/:id",
  bg.CsrfShield.verify,
  bg.ApiKeyShield.build(Env.API_KEY),
  bg.Route(SuspendTwitterRss)
);

app.post(
  "/activate-rss/:id",
  bg.CsrfShield.verify,
  bg.ApiKeyShield.build(Env.API_KEY),
  bg.Route(ActivateTwitterRss)
);

app.post(
  "/add-pharse-to-filter-out",
  bg.CsrfShield.verify,
  bg.ApiKeyShield.build(Env.API_KEY),
  bg.Route(AddPhraseToFilterOut)
);

app.get("*", (_request, response) => response.redirect("/"));

sentry.report(app, [
  bg.Errors.AccessDeniedError,
  TwitterUserDoesNotExistsError,
  TwitterRssFeedAlreadyExistsError,
  TwitterRssFeedFilterTransitionError,
]);

app.use(ErrorHandler.handle);

const server = app.listen(Env.PORT, () =>
  bg.Reporter.info(`Server running on port: ${Env.PORT}`)
);

bg.GracefulShutdown.applyTo(server, () => {
  bg.Reporter.info("Shutting down job scheduler");
  Scheduler.stop();
});
