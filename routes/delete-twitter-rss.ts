import express from "express";

import { TwitterUserId } from "../value-objects/twitter-user-id";
import { TwitterRssFeed } from "../aggregates/twitter-rss-feed";

export async function DeleteTwitterRss(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterId = TwitterUserId.parse(Number(request.params.id));

  const twitterRss = await new TwitterRssFeed().build();
  await twitterRss.delete(twitterId);

  return response.redirect("/");
}
