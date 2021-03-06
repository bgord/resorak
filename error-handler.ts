import express from "express";
import { Errors } from "@bgord/node";

import {
  TwitterUserDoesNotExistsError,
  TwitterRssFeedAlreadyExistsError,
} from "./aggregates/twitter-rss-feed";

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

    if (error instanceof Errors.AccessDeniedError && error.reason === "csrf") {
      await request.flash("error", "Please, try again later");
      return response.redirect("/");
    }

    if (error instanceof TwitterUserDoesNotExistsError) {
      await request.flash("error", "No Twitter user with this handle");
      return response.redirect("/");
    }

    if (error instanceof TwitterRssFeedAlreadyExistsError) {
      await request.flash(
        "error",
        "RSS feed for this Twitter handle already exists"
      );
      return response.redirect("/");
    }

    if (error instanceof Errors.InvalidCredentialsError) {
      return response.redirect("/login");
    }

    if (error instanceof Errors.AccessDeniedError && error.reason === "auth") {
      return response.redirect("/");
    }

    return next(error);
  };
}
