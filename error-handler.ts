import express from "express";
import { Errors } from "@bgord/node";

export class ErrorHandler {
  static handle: express.ErrorRequestHandler = async (
    error,
    request,
    response,
    next
    /* eslint-disable max-params */
  ) => {
    /* eslint-disable no-console */
    console.error(error);

    if (
      error instanceof Errors.AccessDeniedError &&
      error.reason === "api-key"
    ) {
      await request.flash("error", "Invalid API KEY");

      return response.redirect("/");
    }

    return next(error);
  };
}
