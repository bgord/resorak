import { Reporter } from "@bgord/node";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import { TwitterRss } from "./aggregates/twitter-rss";

export const Scheduler = new ToadScheduler();

const task = new AsyncTask("twitter rss feed creator", async () => {
  Reporter.info("twitter rss feed creator");

  const twitterRss = await new TwitterRss().build();

  const twitterRssFeeds = twitterRss.getFeeds();

  for (const feed of twitterRssFeeds) {
    await twitterRss.generateFeed(feed);
  }
});

const job = new SimpleIntervalJob({ minutes: 1, runImmediately: true }, task);

Scheduler.addSimpleIntervalJob(job);
