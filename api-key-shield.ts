import * as express from "express";
import { Errors } from "@bgord/node";

import { ApiKeyType } from "./value-objects/api-key";

export class ApiKeyShield {
  static build(apiKey: ApiKeyType) {
    return function verify(
      request: express.Request,
      _response: express.Response,
      next: express.NextFunction
    ) {
      if (request.body.apiKey === apiKey) {
        return next();
      }

      throw new Errors.AccessDeniedError({ reason: "general" });
    };
  }
}
