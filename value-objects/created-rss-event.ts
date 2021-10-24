import { z } from "zod";
import { EventDraft } from "@bgord/node";

import { TwitterHandle } from "./twitter-handle";

export const CREATED_RSS_EVENT = "CREATED_RSS";

export const CreatedRssEvent = EventDraft.merge(
  z.object({
    name: z.literal(CREATED_RSS_EVENT),
    version: z.literal(1),
    payload: z.object({
      twitterHandle: TwitterHandle,
    }),
  })
);

export type CreatedRssEventType = z.infer<typeof CreatedRssEvent>;
