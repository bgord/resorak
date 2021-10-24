import express from "express";

import { TwitterRssFeeds } from "../aggregates/twitter-rss";

export async function Home(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterRssFeeds = await new TwitterRssFeeds().build();

  const vars = {
    feeds: twitterRssFeeds.getAll(),
  };

  return response.render("home", vars);
}
