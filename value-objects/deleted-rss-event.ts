import { z } from "zod";
import { EventDraft } from "@bgord/node";

import { TwitterUserId } from "../value-objects/twitter-user-id";

export const DELETED_RSS_EVENT = "DELETED_RSS";

export const DeletedRssEvent = EventDraft.merge(
  z.object({
    name: z.literal(DELETED_RSS_EVENT),
    version: z.literal(1),
    payload: z.object({
      twitterUserId: TwitterUserId,
    }),
  })
);

export type DeletedRssEventType = z.infer<typeof DeletedRssEvent>;
