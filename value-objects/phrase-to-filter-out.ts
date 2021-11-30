import { z } from "zod";

export const PhraseToFilterOut = z.string().nonempty();

export type PhraseToFilterOutType = z.infer<typeof PhraseToFilterOut>;
