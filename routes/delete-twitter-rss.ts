import express from "express";

import { TwitterId } from "../value-objects/twitter-id";
import { TwitterRss } from "../aggregates/twitter-rss";

export async function DeleteTwitterRss(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterRss = await new TwitterRss().build();

  const twitterId = TwitterId.parse(request.params.id);

  await twitterRss.deleteFeed(twitterId);

  return response.redirect("/");
}
