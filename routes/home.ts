import express from "express";
import { CsrfShield } from "@bgord/node";
import { formatDistanceToNow } from "date-fns";

import { FeedlyHitRepository } from "../repositories/feedly-hit-repository";
import { PhrasesToFilterOutRepository } from "../repositories/phrases-to-filter-out-repository";
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
  const lastFeedlyHitTimestamp = await FeedlyHitRepository.getLatest();

  const vars = {
    feeds: twitterRssFeed.getAll().map((feed) => ({
      ...feed,
      ...Services.TwitterRssFeedLocationsGenerator.generate(feed.twitterUserId),
      isActive: feed.status === VO.TwitterRssFeedStatusEnum.active,
      isSuspended: feed.status === VO.TwitterRssFeedStatusEnum.suspended,
    })),

    twitterUserThumbnailPlaceholder: VO.TwitterUserThumbnailPlaceholder,

    lastFeedlyHitTimestamp: lastFeedlyHitTimestamp
      ? formatDistanceToNow(lastFeedlyHitTimestamp)
      : null,

    phrasesToFilterOut: await PhrasesToFilterOutRepository.find(),

    error: messages[0],
    ...CsrfShield.extract(request),
  };

  return response.render("home", vars);
}
