import express from "express";
import { CsrfShield } from "@bgord/node";

import { TwitterRss } from "../aggregates/twitter-rss";
import { TwitterRssLocationGenerator } from "../services/twitter-rss-location-generator";

export async function Home(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterRss = await new TwitterRss().build();

  const vars = {
    feeds: twitterRss.getFeeds().map((feed) => ({
      ...feed,
      ...TwitterRssLocationGenerator.generate(feed),
    })),

    ...CsrfShield.extract(request),
  };

  return response.render("home", vars);
}
