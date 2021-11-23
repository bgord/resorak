import * as bg from "@bgord/node";
import express from "express";

export class FeedlyHitLogger {
  static handle() {
    async function handler(
      request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      const userAgent = request.headers["user-agent"];

      if (!userAgent) return next();

      const isFeedly = /feedly/i.test(userAgent);

      bg.Reporter.info(
        `URL: ${request.url} UA: ${userAgent} [isFeedly=${isFeedly}]`
      );

      return next();
    }

    return bg.Middleware(handler);
  }
}
