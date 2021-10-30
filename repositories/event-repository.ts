import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import {
  CreatedRssEventType,
  CreatedRssEvent,
} from "../value-objects/created-rss-event";
import {
  DeletedRssEventType,
  DeletedRssEvent,
} from "../value-objects/deleted-rss-event";

const prisma = new PrismaClient();

type AcceptedEvent = typeof CreatedRssEvent | typeof DeletedRssEvent;
type AcceptedEventType = CreatedRssEventType | DeletedRssEventType;

export class EventRepository {
  async find<T extends AcceptedEvent>(acceptedEvent: T): Promise<z.infer<T>[]> {
    const events = await prisma.event.findMany({
      where: { name: acceptedEvent._type.name },
      orderBy: {
        createdAt: "asc",
      },
    });

    return events
      .map((event) => ({
        ...event,
        payload: JSON.parse(event.payload),
      }))
      .map((event) => acceptedEvent.parse(event));
  }

  async findMany<T extends AcceptedEvent[]>(
    acceptedEvents: T
  ): Promise<z.infer<T[0]>[]> {
    const events = await prisma.event.findMany({
      where: {
        name: {
          in: acceptedEvents.map((e) => e._type.name),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return events
      .map((event) => ({
        ...event,
        payload: JSON.parse(event.payload),
      }))
      .map((event) => {
        const parser = acceptedEvents.find(
          (acceptedEvent) => acceptedEvent._type.name === event.name
        );

        if (!parser) return undefined;

        return parser.parse(event);
      })
      .filter(
        (event: z.infer<T[0]> | undefined): event is z.infer<T[0]> =>
          event !== undefined
      );
  }

  async save(event: AcceptedEventType) {
    return prisma.event.create({
      data: { ...event, payload: JSON.stringify(event.payload) },
    });
  }
}
