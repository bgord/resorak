import { z } from "zod";

import { TwitterId } from "./twitter-id";
import { TwitterHandle } from "./twitter-handle";

export const TwitterUser = z.object({
  id: TwitterId,
  name: TwitterHandle,
});

export type TwitterUserType = z.infer<typeof TwitterUser>;
