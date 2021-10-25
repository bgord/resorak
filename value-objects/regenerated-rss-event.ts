import { z } from "zod";
import { EventDraft } from "@bgord/node";

import { TwitterRssFeed } from "../value-objects/twitter-rss-feed";

export const REGENERATED_RSS_EVENT = "REGENERATED_RSS";

export const RegeneratedRssEvent = EventDraft.merge(
  z.object({
    name: z.literal(REGENERATED_RSS_EVENT),
    version: z.literal(1),
    payload: z.array(TwitterRssFeed),
  })
);

export type RegeneratedRssEventType = z.infer<typeof RegeneratedRssEvent>;
