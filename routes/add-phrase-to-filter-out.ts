import express from "express";

import * as VO from "../value-objects";

export async function AddPhraseToFilterOut(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const phraseToFilterOut = VO.PhraseToFilterOut.parse(
    request.body.phraseToFilterOut
  );

  return response.redirect("/");
}
