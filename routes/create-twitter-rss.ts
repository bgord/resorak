import express from "express";

import { TwitterHandle } from "../value-objects/twitter-handle";
import { TwitterRss } from "../aggregates/twitter-rss";

export async function CreateTwitterRss(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterRss = await new TwitterRss().build();

  const twitterHandle = TwitterHandle.parse(request.body.handle);

  await twitterRss.createFeed(twitterHandle);

  return response.redirect("/");
}
