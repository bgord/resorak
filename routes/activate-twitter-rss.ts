import express from "express";

import * as VO from "../value-objects";
import { TwitterRssFeed } from "../aggregates/twitter-rss-feed";

export async function ActivateTwitterRss(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterId = VO.TwitterUserId.parse(Number(request.params.id));

  const twitterRssFeed = await new TwitterRssFeed().build();
  await twitterRssFeed.activate(twitterId);

  return response.redirect(`/dashboard?tab=actions&id=${twitterId}`);
}
