import Emittery from "emittery";
import { Reporter } from "@bgord/node";
import { promises as fs } from "fs";

import { TwitterRss } from "./aggregates/twitter-rss";

import {
  CreatedRssEventType,
  CREATED_RSS_EVENT,
} from "./value-objects/created-rss-event";

import {
  RegeneratedRssEvent,
  RegeneratedRssEventType,
  REGENERATED_RSS_EVENT,
} from "./value-objects/regenerated-rss-event";

Emittery.isDebugEnabled = true;

export const emittery = new Emittery<{
  CREATED_RSS: CreatedRssEventType;
  REGENERATED_RSS: RegeneratedRssEventType;
}>();

emittery.on(CREATED_RSS_EVENT, (feed) => {
  Reporter.info(`Created Twitter RSS for: ${feed.payload.twitterUserName}`);

  const regeneratedRssEvent = RegeneratedRssEvent.parse({
    name: REGENERATED_RSS_EVENT,
    version: 1,
    payload: [feed.payload],
  });

  emittery.emit(REGENERATED_RSS_EVENT, regeneratedRssEvent);
});

emittery.on(REGENERATED_RSS_EVENT, async (event) => {
  Reporter.info("Regenerating Twitter RSS...");

  const twitterRss = await new TwitterRss().build();

  if (event.payload.length === 0) {
    Reporter.info("Nothing to regenerate now!");
  }

  for (const feed of event.payload) {
    Reporter.info(`Processing ${feed.twitterUserName}`);

    const rss = await twitterRss.generateFeed(feed);

    await fs.writeFile(rss.location.path, rss.content);

    Reporter.info(`Processed ${feed.twitterUserName}`);
  }
});
