import express from "express";

import * as VO from "../value-objects";
import { PhrasesToFilterOutRepository } from "../repositories/phrases-to-filter-out-repository";

export async function DeletePhraseToFilterOut(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const phraseId = VO.PhraseToFilterOut._def
    .shape()
    .id.parse(request.params.id);

  await PhrasesToFilterOutRepository.remove(phraseId);

  return response.redirect("/dashboard");
}
