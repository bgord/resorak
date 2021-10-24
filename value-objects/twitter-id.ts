import { z } from "zod";

export const TwitterId = z.number().positive();

export type TwitterIdType = z.infer<typeof TwitterId>;
