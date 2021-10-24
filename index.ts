import express from "express";

import {
  Reporter,
  addExpressEssentials,
  GracefulShutdown,
  Handlebars,
  helmetScriptsCspConfig,
  helmetStylesCspConfig,
  deepMerge,
} from "@bgord/node";

import { Env } from "./env";

import { Home } from "./routes/home";
import { CreateRss } from "./routes/create-rss";

const app = express();

addExpressEssentials(app, {
  helmet: deepMerge(helmetScriptsCspConfig, helmetStylesCspConfig),
});
new Handlebars().applyTo(app);

app.get("/", Home);
app.post("/create-rss", CreateRss);

const server = app.listen(Env.PORT, () =>
  Reporter.info(`Server running on port: ${Env.PORT}`)
);

GracefulShutdown.applyTo(server, () => {
  Reporter.info("shutting down job scheduler");
});
