import express from "express";
import { CsrfShield } from "@bgord/node";

import { TwitterRssFeed } from "../aggregates/twitter-rss-feed";
import { TwitterRssLocationGenerator } from "../services/twitter-rss-location-generator";

export async function Home(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterRss = await new TwitterRssFeed().build();

  const messages = await request.consumeFlash("error");

  const vars = {
    feeds: twitterRss.getFeeds().map((feed) => ({
      ...feed,
      ...TwitterRssLocationGenerator.generate(feed.twitterUserId),
    })),

    ...CsrfShield.extract(request),

    error: messages[0],
  };

  return response.render("home", vars);
}
