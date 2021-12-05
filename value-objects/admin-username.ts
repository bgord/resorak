import { z } from "zod";

export const AdminUsername = z.string().nonempty().max(12);

export type AdminUsernameType = z.infer<typeof AdminUsername>;
