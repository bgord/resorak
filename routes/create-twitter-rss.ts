import express from "express";

import * as VO from "../value-objects";
import { TwitterRssFeed } from "../aggregates/twitter-rss-feed";

export async function CreateTwitterRss(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterUserName = VO.TwitterUserName.parse(
    request.body.twitterUserName
  );

  const twitterRssFeed = await new TwitterRssFeed().build();
  await twitterRssFeed.create(twitterUserName);

  return response.redirect("/");
}
