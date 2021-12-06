import { z } from "zod";

export const AdminPassword = z.string().min(5).max(20);

export type AdminPasswordType = z.infer<typeof AdminPassword>;
