import { PrismaClient } from "@prisma/client";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export class PhrasesToFilterOutRepository {
  static async save(content: VO.PhraseToFilterOutType["content"]) {
    await prisma.phraseToFilterOut.create({ data: { content } });
  }

  static async find(): Promise<VO.PhraseToFilterOutType[]> {
    return prisma.phraseToFilterOut.findMany({
      orderBy: { createdAt: "asc" },
    });
  }

  static async remove(phraseId: VO.PhraseToFilterOutType["id"]) {
    return prisma.phraseToFilterOut.delete({ where: { id: phraseId } });
  }
}
