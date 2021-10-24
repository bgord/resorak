import express from "express";

import { TwitterRss } from "../aggregates/twitter-rss";

export async function Home(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterRss = await new TwitterRss().build();

  const vars = {
    feeds: twitterRss.getFeeds(),
  };

  return response.render("home", vars);
}
