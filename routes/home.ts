import express from "express";

export async function Home(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  return response.render("home");
}
