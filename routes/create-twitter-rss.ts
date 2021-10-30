import express from "express";

import { TwitterHandle } from "../value-objects/twitter-handle";
import { TwitterRssFeed } from "../aggregates/twitter-rss-feed";

export async function CreateTwitterRss(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterRss = await new TwitterRssFeed().build();

  const twitterHandle = TwitterHandle.parse(request.body.handle);

  await twitterRss.create(twitterHandle);

  return response.redirect("/");
}
