import express from "express";
import { CsrfShield } from "@bgord/node";

import { TwitterRssFeed } from "../aggregates/twitter-rss-feed";
import * as Services from "../services";

export async function Home(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterRssFeed = await new TwitterRssFeed().build();

  const messages = await request.consumeFlash("error");

  const vars = {
    feeds: twitterRssFeed.getAll().map((feed) => ({
      ...feed,
      ...Services.TwitterRssFeedLocationsGenerator.generate(feed.twitterUserId),
    })),

    ...CsrfShield.extract(request),

    error: messages[0],
  };

  return response.render("home", vars);
}
