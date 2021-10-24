import { z } from "zod";

export const TwitterDescription = z.string();

export type TwitterDescriptionType = z.infer<typeof TwitterDescription>;
