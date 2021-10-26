import { z } from "zod";

export const ApiKey = z.string().length(64);

export type ApiKeyType = z.infer<typeof ApiKey>;
