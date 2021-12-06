import express from "express";
import passport from "passport";
import { Strategy as PassportLocalStrategy } from "passport-local";
import * as bg from "@bgord/node";

import { Env } from "../env";

export class AuthShield {
  static applyTo(app: express.Application): void {
    passport.use(
      new PassportLocalStrategy(async (username, password, callback) => {
        if (username !== Env.ADMIN_USERNAME) {
          return callback(new InvalidCredentialsError());
        }

        if (password !== Env.ADMIN_PASSWORD) {
          return callback(new InvalidCredentialsError());
        }

        return callback(null, username);
      })
    );

    passport.serializeUser((user, callback) => callback(null, user));
    passport.deserializeUser((user, callback) =>
      callback(null, user as string)
    );

    app.use(passport.initialize());
    app.use(passport.authenticate("session"));
  }

  static attach = bg.Middleware(
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
    })
  );

  static verify = bg.Middleware(AuthShield._verify);

  static async _verify(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    if (request.isAuthenticated()) {
      return next();
    }

    return response.redirect("/");
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}
