import { Reporter } from "@bgord/node";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import * as Events from "./events";

import { emittery } from "./events";
import { Env } from "./env";

import { TwitterRssFeed } from "./aggregates/twitter-rss-feed";

export const Scheduler = new ToadScheduler();

const task = new AsyncTask("twitter rss feed creator", async () => {
  Reporter.info("twitter rss feed creator");

  const twitterRssFeed = await new TwitterRssFeed().build();
  const feeds = twitterRssFeed.getActive();

  const regeneratedRssEvent = Events.RegeneratedRssEvent.parse({
    name: Events.REGENERATED_RSS_EVENT,
    version: 1,
    payload: feeds,
  });

  emittery.emit(Events.REGENERATED_RSS_EVENT, regeneratedRssEvent);
});

const job = new SimpleIntervalJob(
  {
    minutes: Env.TWITTER_RSS_REGENERATION_INTERVAL_IN_MINUTES,
    runImmediately: false,
  },
  task
);

Scheduler.addSimpleIntervalJob(job);
