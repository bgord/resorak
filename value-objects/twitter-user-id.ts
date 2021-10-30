import { z } from "zod";

export const TwitterUserId = z.number().positive();

export type TwitterUserIdType = z.infer<typeof TwitterUserId>;
