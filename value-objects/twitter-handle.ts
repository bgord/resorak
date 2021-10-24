import { z } from "zod";

export const TwitterHandle = z.string().max(48).nonempty();

export type TwitterHandleType = z.infer<typeof TwitterHandle>;
