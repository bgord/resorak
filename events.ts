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

emittery.on(CREATED_RSS_EVENT, (event) =>
  Reporter.info(`Created Twitter RSS for: ${event.payload.twitterUserName}`)
);
