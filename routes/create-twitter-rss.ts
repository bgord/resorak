import express from "express";

import { TwitterUserName } from "../value-objects/twitter-user-name";
import { TwitterRssFeed } from "../aggregates/twitter-rss-feed";

export async function CreateTwitterRss(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterUserName = TwitterUserName.parse(request.body.twitterUserName);

  const twitterRssFeed = await new TwitterRssFeed().build();
  await twitterRssFeed.create(twitterUserName);

  return response.redirect("/");
}
