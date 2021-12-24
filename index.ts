import express from "express";
import { flash } from "express-flash-message";

import * as bg from "@bgord/node";

import { Env } from "./env";
import { Scheduler } from "./jobs";
import { ErrorHandler } from "./error-handler";

import { Home } from "./routes/home";
import { Login } from "./routes/login";
import { Dashboard } from "./routes/dashboard";
import { CreateTwitterRss } from "./routes/create-twitter-rss";
import { DeleteTwitterRss } from "./routes/delete-twitter-rss";
import { RegenerateTwitterRss } from "./routes/regenerate-twitter-rss";
import { SkipReplyTweetsInRss } from "./routes/skip-reply-tweets-in-rss";
import { IncludeReplyTweetsInRss } from "./routes/include-reply-tweets-in-rss";
import { SuspendTwitterRss } from "./routes/suspend-twitter-rss";
import { ActivateTwitterRss } from "./routes/activate-twitter-rss";
import { AddPhraseToFilterOut } from "./routes/add-phrase-to-filter-out";
import { DeletePhraseToFilterOut } from "./routes/delete-phrase-to-filter-out";

import {
  TwitterUserDoesNotExistsError,
  TwitterRssFeedAlreadyExistsError,
  TwitterRssFeedFilterTransitionError,
} from "./aggregates/twitter-rss-feed";
import { FeedlyHitLogger } from "./middlewares/feedly-hit-logger";

const app = express();
const AuthShield = new bg.EnvUserAuthShield({
  ADMIN_USERNAME: Env.ADMIN_USERNAME,
  ADMIN_PASSWORD: Env.ADMIN_PASSWORD,
});

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
AuthShield.applyTo(app);

app.use(FeedlyHitLogger.handle());

app.get("/", bg.CsrfShield.attach, Home);

app.get("/login", bg.CsrfShield.attach, Login);
app.post(
  "/login",
  bg.CsrfShield.verify,
  AuthShield.attach,
  (_request, response) => response.redirect("/dashboard")
);
app.get("/dashboard", AuthShield.verify, Dashboard);
app.get("/logout", (request, response) => {
  request.logout();
  return response.redirect("/login");
});

app.post(
  "/create-rss",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(CreateTwitterRss)
);
app.delete(
  "/delete-rss/:id",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(DeleteTwitterRss)
);
app.post(
  "/regenerate-rss/:id",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(RegenerateTwitterRss)
);

app.post(
  "/skip-reply-tweets-in-rss/:id",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(SkipReplyTweetsInRss)
);

app.post(
  "/include-reply-tweets-in-rss/:id",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(IncludeReplyTweetsInRss)
);

app.post(
  "/suspend-rss/:id",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(SuspendTwitterRss)
);

app.post(
  "/activate-rss/:id",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(ActivateTwitterRss)
);

app.post(
  "/add-pharse-to-filter-out",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(AddPhraseToFilterOut)
);

app.delete(
  "/delete-phrase-to-filter-out/:id",
  bg.CsrfShield.verify,
  AuthShield.verify,
  bg.Route(DeletePhraseToFilterOut)
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
