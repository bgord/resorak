import { Reporter } from "@bgord/node";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import { emittery } from "./events";

import { TwitterRss } from "./aggregates/twitter-rss";

import {
  RegeneratedRssEvent,
  REGENERATED_RSS_EVENT,
} from "./value-objects/regenerated-rss-event";

export const Scheduler = new ToadScheduler();

const task = new AsyncTask("twitter rss feed creator", async () => {
  Reporter.info("twitter rss feed creator");

  const twitterRss = await new TwitterRss().build();
  const twitterRssFeeds = twitterRss.getFeeds();

  const regeneratedRssEvent = RegeneratedRssEvent.parse({
    name: REGENERATED_RSS_EVENT,
    version: 1,
    payload: twitterRssFeeds,
  });

  emittery.emit(REGENERATED_RSS_EVENT, regeneratedRssEvent);
});

const job = new SimpleIntervalJob({ minutes: 1, runImmediately: true }, task);

Scheduler.addSimpleIntervalJob(job);
