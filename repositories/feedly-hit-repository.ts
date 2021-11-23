import * as VO from "../value-objects";
import * as Events from "../events";
import { EventRepository } from "../repositories/event-repository";

export class FeedlyHitRepository {
  static async save() {
    const feedlyHitEvent = Events.IncludeReplyTweetsInRssEvent.parse({
      name: Events.FEEDLY_HIT_EVENT,
      version: 1,
      payload: {
        timestamp: Date.now(),
      },
    });

    await EventRepository.save(feedlyHitEvent);
  }

  static async getLatest() {}
}
