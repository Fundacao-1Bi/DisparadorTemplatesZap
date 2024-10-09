import { z } from "zod";

export const formSchema = z.object({
  token: z.string().min(50).max(2000),
  phoneNumberId: z.string().min(5).max(2000),
  templateId: z.string().min(1).max(2000),
  base: z.string().min(1).max(20000000),
});
