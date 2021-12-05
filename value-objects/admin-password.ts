import argon2 from "argon2";
import { z } from "zod";

export const AdminPassword = z
  .string()
  .min(6)
  .max(128)
  .transform((value) => argon2.hash(value));

export type AdminPasswordType = z.infer<typeof AdminPassword>;
