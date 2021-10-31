import { z } from "zod";
import Emittery from "emittery";
import { Reporter, EventDraft } from "@bgord/node";

import { TwitterRssFeed } from "./aggregates/twitter-rss-feed";
import * as Services from "./services";
import * as VO from "./value-objects";

export const CREATED_RSS_EVENT = "CREATED_RSS";
export const CreatedRssEvent = EventDraft.merge(
  z.object({
    name: z.literal(CREATED_RSS_EVENT),
    version: z.literal(1),
    payload: VO.TwitterUser,
  })
);
export type CreatedRssEventType = z.infer<typeof CreatedRssEvent>;

export const DELETED_RSS_EVENT = "DELETED_RSS";
export const DeletedRssEvent = EventDraft.merge(
  z.object({
    name: z.literal(DELETED_RSS_EVENT),
    version: z.literal(1),
    payload: z.object({
      twitterUserId: VO.TwitterUserId,
    }),
  })
);
export type DeletedRssEventType = z.infer<typeof DeletedRssEvent>;

export const REGENERATED_RSS_EVENT = "REGENERATED_RSS";
export const RegeneratedRssEvent = EventDraft.merge(
  z.object({
    name: z.literal(REGENERATED_RSS_EVENT),
    version: z.literal(1),
    payload: z.array(VO.TwitterRssFeed),
  })
);
export type RegeneratedRssEventType = z.infer<typeof RegeneratedRssEvent>;

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
