import { PrismaClient } from "@prisma/client";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export class PhrasesToFilterOutRepository {
  static async save(phrase: VO.PhraseToFilterOutType) {
    await prisma.phraseToFilterOut.create({ data: { phrase } });
  }

  static async find(): Promise<VO.PhraseToFilterOutType[]> {
    const result = await prisma.phraseToFilterOut.findMany({
      orderBy: { createdAt: "asc" },
    });

    return result.map((item) => item.phrase);
  }
}
