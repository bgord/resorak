import { z } from "zod";

export const TwitterUserDescription = z.string();

export type TwitterUserDescriptionType = z.infer<typeof TwitterUserDescription>;
