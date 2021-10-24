import express from "express";

import { TwitterHandle } from "../value-objects/twitter-handle";
import { TwitterRssFeeds } from "../aggregates/twitter-rss";

export async function CreateRss(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterRssFeeds = await new TwitterRssFeeds().build();

  const twitterHandle = TwitterHandle.parse(request.body.handle);

  await twitterRssFeeds.create(twitterHandle);

  return response.redirect("/");
}
