import Emittery from "emittery";
import { Reporter } from "@bgord/node";

import { TwitterRssFeed } from "./aggregates/twitter-rss-feed";
import * as Services from "./services";

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

  const twitterRssFeed = await new TwitterRssFeed().build();

  if (event.payload.length === 0) {
    Reporter.info("Nothing to regenerate now!");
  }

  for (const feed of event.payload) {
    Reporter.info(`Processing ${feed.twitterUserName}`);
    await twitterRssFeed.generate(feed);
    Reporter.info(`Processed ${feed.twitterUserName}`);
  }
});

emittery.on(DELETED_RSS_EVENT, async (event) => {
  Reporter.info(`Deleted RSS for ${event.payload.twitterUserId}...`);

  const locations = Services.TwitterRssFeedLocationsGenerator.generate(
    event.payload.twitterUserId
  );

  await Services.TwitterRssFeedFileCreator.delete(locations);

  Reporter.info(`Deleted file ${locations.path}`);
});
