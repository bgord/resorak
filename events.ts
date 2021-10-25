import Emittery from "emittery";
import { Reporter } from "@bgord/node";

import {
  CreatedRssEventType,
  CREATED_RSS_EVENT,
} from "./value-objects/created-rss-event";

Emittery.isDebugEnabled = true;

export const emittery = new Emittery<{
  CREATED_RSS: CreatedRssEventType;
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

