import { Reporter } from "@bgord/node";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

export const Scheduler = new ToadScheduler();

const task = new AsyncTask("twitter rss feed creator", async () => {
  Reporter.info("twitter rss feed creator");
});

const job = new SimpleIntervalJob({ minutes: 1, runImmediately: true }, task);

Scheduler.addSimpleIntervalJob(job);
