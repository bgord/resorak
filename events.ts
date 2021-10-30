import Emittery from "emittery";
import { Reporter } from "@bgord/node";
import { promises as fs } from "fs";

import { TwitterRssFeed } from "./aggregates/twitter-rss-feed";
import { TwitterRssLocationGenerator } from "./services/twitter-rss-location-generator";

import {
  CreatedRssEventType,
  CREATED_RSS_EVENT,
} from "./value-objects/created-rss-event";

import {
  DeletedRssEventType,
  DELETED_RSS_EVENT,
} from "./value-objects/deleted-rss-event";

import {
  RegeneratedRssEvent,
  RegeneratedRssEventType,
  REGENERATED_RSS_EVENT,
} from "./value-objects/regenerated-rss-event";

Emittery.isDebugEnabled = true;

export const emittery = new Emittery<{
  CREATED_RSS: CreatedRssEventType;
  REGENERATED_RSS: RegeneratedRssEventType;
  DELETED_RSS: DeletedRssEventType;
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

  const twitterRss = await new TwitterRssFeed().build();

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

emittery.on(DELETED_RSS_EVENT, async (event) => {
  Reporter.info(`Deleted RSS for ${event.payload.twitterUserId}...`);

  const location = TwitterRssLocationGenerator.generate(
    event.payload.twitterUserId
  );

  try {
    await fs.unlink(location.path);
    Reporter.info(`Deleted file ${location.path}`);
    /* eslint-disable no-empty */
  } catch (error) {}
});
