import express from "express";

import {
  Reporter,
  addExpressEssentials,
  GracefulShutdown,
  Handlebars,
  helmetScriptsCspConfig,
  helmetStylesCspConfig,
  deepMerge,
  Session,
} from "@bgord/node";

import { Env } from "./env";
import { Scheduler } from "./jobs";

import { Home } from "./routes/home";
import { CreateTwitterRss } from "./routes/create-twitter-rss";

import { ApiKeyShield } from "./api-key-shield";

const app = express();

addExpressEssentials(app, {
  helmet: deepMerge(helmetScriptsCspConfig, helmetStylesCspConfig),
});
new Handlebars().applyTo(app);
new Session({ secret: Env.COOKIE_SECRET }).applyTo(app);

app.get("/", Home);
app.post("/create-rss", ApiKeyShield.build(Env.API_KEY), CreateTwitterRss);

const server = app.listen(Env.PORT, () =>
  Reporter.info(`Server running on port: ${Env.PORT}`)
);

GracefulShutdown.applyTo(server, () => {
  Reporter.info("shutting down job scheduler");
  Scheduler.stop();
});
