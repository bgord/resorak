import express from "express";
import { CsrfShield } from "@bgord/node";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const vars = {
    ...CsrfShield.extract(request),
  };

  return response.render("dashboard", vars);
}
