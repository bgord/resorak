import express from "express";

import { TwitterId } from "../value-objects/twitter-id";
import { TwitterRssFeed } from "../aggregates/twitter-rss-feed";

export async function DeleteTwitterRss(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterRss = await new TwitterRssFeed().build();

  const twitterId = TwitterId.parse(Number(request.params.id));

  await twitterRss.deleteFeed(twitterId);

  return response.redirect("/");
}
