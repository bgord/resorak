import { z } from "zod";

export const TwitterBearerToken = z.string().nonempty();

export type TwitterBearerTokenType = z.infer<typeof TwitterBearerToken>;
