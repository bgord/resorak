import express from "express";
import { flash } from "express-flash-message";

import {
  Reporter,
  addExpressEssentials,
  GracefulShutdown,
  Handlebars,
  helmetScriptsCspConfig,
  helmetStylesCspConfig,
  deepMerge,
  Session,
  CsrfShield,
  ApiKeyShield,
  Route,
} from "@bgord/node";

import { Env } from "./env";
import { Scheduler } from "./jobs";
import { ErrorHandler } from "./error-handler";

import { Home } from "./routes/home";
import { CreateTwitterRss } from "./routes/create-twitter-rss";

const app = express();

addExpressEssentials(app, {
  helmet: deepMerge(helmetScriptsCspConfig, helmetStylesCspConfig),
});
new Handlebars().applyTo(app);
new Session({ secret: Env.COOKIE_SECRET }).applyTo(app);

app.use(flash({ sessionKeyName: "flashMessage" }));

app.get("/", CsrfShield.attach, Home);
app.post(
  "/create-rss",
  ApiKeyShield.build(Env.API_KEY),
  CsrfShield.verify,
  Route(CreateTwitterRss)
);

app.use(ErrorHandler.handle);

const server = app.listen(Env.PORT, () =>
  Reporter.info(`Server running on port: ${Env.PORT}`)
);

GracefulShutdown.applyTo(server, () => {
  Reporter.info("Shutting down job scheduler");
  Scheduler.stop();
});
