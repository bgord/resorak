import { z } from "zod";
import { Schema } from "@bgord/node";

import { PhraseToFilterOutContent } from "./phrase-to-filter-out-content";

export const PhraseToFilterOut = z.object({
  id: Schema.UUID,
  content: PhraseToFilterOutContent,
});

export type PhraseToFilterOutType = z.infer<typeof PhraseToFilterOut>;
