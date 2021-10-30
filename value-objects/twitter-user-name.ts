import { z } from "zod";

export const TwitterUserName = z.string().max(48).nonempty();

export type TwitterUserNameType = z.infer<typeof TwitterUserName>;
