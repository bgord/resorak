import { z } from "zod";

export const TwitterBearerToken = z.string().length(112);

export type TwitterBearerTokenType = z.infer<typeof TwitterBearerToken>;
