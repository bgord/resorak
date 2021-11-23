import express from "express";
import { CsrfShield } from "@bgord/node";

import { FeedlyHitRepository } from "../repositories/feedly-hit-repository";
import { TwitterRssFeed } from "../aggregates/twitter-rss-feed";
import * as Services from "../services";
import * as VO from "../value-objects";

export async function Home(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const twitterRssFeed = await new TwitterRssFeed().build();

  const messages = await request.consumeFlash("error");

  const vars = {
    feeds: twitterRssFeed.getAll().map((feed) => ({
      ...feed,
      ...Services.TwitterRssFeedLocationsGenerator.generate(feed.twitterUserId),
      isActive: feed.status === VO.TwitterRssFeedStatusEnum.active,
      isSuspended: feed.status === VO.TwitterRssFeedStatusEnum.suspended,
    })),

    twitterUserThumbnailPlaceholder: VO.TwitterUserThumbnailPlaceholder,

    lastFeedlyHitTimestamp: await FeedlyHitRepository.getLatest(),
    error: messages[0],
    ...CsrfShield.extract(request),
  };

  return response.render("home", vars);
}
