import { PrismaClient } from "@prisma/client";
import { EventType, ParsedEventType } from "@bgord/node";

import { CreatedRssEventType } from "../value-objects/created-rss-event";
import { DeletedRssEventType } from "../value-objects/deleted-rss-event";

const prisma = new PrismaClient();

export class EventRepository {
  async find(name: EventType["name"]): Promise<ParsedEventType[]> {
    const events = await prisma.event.findMany({
      where: { name },
      orderBy: {
        createdAt: "asc",
      },
    });

    return events.map((event) => ({
      ...event,
      payload: JSON.parse(event.payload),
    }));
  }

  async findMany(names: EventType["name"][]): Promise<ParsedEventType[]> {
    const events = await prisma.event.findMany({
      where: {
        name: {
          in: names,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return events.map((event) => ({
      ...event,
      payload: JSON.parse(event.payload),
    }));
  }

  async save(event: CreatedRssEventType | DeletedRssEventType) {
    return prisma.event.create({
      data: { ...event, payload: JSON.stringify(event.payload) },
    });
  }
}
