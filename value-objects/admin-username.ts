import { z } from "zod";

export const AdminUsername = z.string().min(5).max(20);

export type AdminUsernameType = z.infer<typeof AdminUsername>;
