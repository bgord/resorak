import { z } from "zod";

export const PhraseToFilterOutContent = z.string().nonempty();

export type PhraseToFilterOutContentType = z.infer<
  typeof PhraseToFilterOutContent
>;
