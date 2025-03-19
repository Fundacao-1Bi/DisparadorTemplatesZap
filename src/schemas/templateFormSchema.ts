import { z } from "zod";

export const formSchema = z.object({
  token: z
    .string()
    .min(50, { message: "O token deve ter no mínimo 50 caracteres." })
    .max(2000, { message: "O token deve ter no máximo 2000 caracteres." }),
  phoneNumberId: z
    .string()
    .min(5, {
      message: "O ID do número de telefone deve ter no mínimo 5 caracteres.",
    })
    .max(2000, {
      message: "O ID do número de telefone deve ter no máximo 2000 caracteres.",
    }),
  templateId: z
    .string()
    .min(1, {
      message:
        "O ID do template é obrigatório e deve ter no mínimo 1 caractere.",
    })
    .max(2000, {
      message: "O ID do template deve ter no máximo 2000 caracteres.",
    }),
  base: z
    .string()
    .min(1, {
      message: "A base é obrigatória e deve ter no mínimo 1 caractere.",
    })
    .max(20000000, {
      message: "A base deve ter no máximo 20000000 caracteres.",
    }),
  imageUrl: z
    .string()
    .max(2000, {
      message: "A URL da imagem deve ter no máximo 2000 caracteres.",
    })
    .optional(),
});
