import express from "express";

import * as VO from "../value-objects";
import { PhrasesToFilterOutRepository } from "../repositories/phrases-to-filter-out-repository";

export async function AddPhraseToFilterOut(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const phraseToFilterOut = VO.PhraseToFilterOut.parse(
    request.body.phraseToFilterOut
  );

  await PhrasesToFilterOutRepository.save(phraseToFilterOut);

  return response.redirect("/dashboard");
}
