import express from "express";
import { flash } from "express-flash-message";

import * as bg from "@bgord/node";

import { Env } from "./env";
import { Scheduler } from "./jobs";
import { ErrorHandler } from "./error-handler";

import { Home } from "./routes/home";
import { CreateTwitterRss } from "./routes/create-twitter-rss";

const app = express();

bg.addExpressEssentials(app, {
  helmet: bg.deepMerge(bg.helmetScriptsCspConfig, bg.helmetStylesCspConfig),
});
new bg.Handlebars().applyTo(app);
new bg.Session({ secret: Env.COOKIE_SECRET }).applyTo(app);

app.use(flash({ sessionKeyName: "flashMessage" }));

app.get("/", bg.CsrfShield.attach, Home);
app.post(
  "/create-rss",
  bg.ApiKeyShield.build(Env.API_KEY),
  bg.CsrfShield.verify,
  bg.Route(CreateTwitterRss)
);

app.use(ErrorHandler.handle);

const server = app.listen(Env.PORT, () =>
  bg.Reporter.info(`Server running on port: ${Env.PORT}`)
);

bg.GracefulShutdown.applyTo(server, () => {
  bg.Reporter.info("Shutting down job scheduler");
  Scheduler.stop();
});
