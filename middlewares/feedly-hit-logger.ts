import * as bg from "@bgord/node";
import express from "express";

import { FeedlyHitRepository } from "../repositories/feedly-hit-repository";

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

      if (isFeedly) {
        await FeedlyHitRepository.save();
      }

      return next();
    }

    return bg.Middleware(handler);
  }
}
