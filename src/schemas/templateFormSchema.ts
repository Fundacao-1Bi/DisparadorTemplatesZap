import { z } from "zod";

export const formSchema = z
  .object({
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
        message:
          "O ID do número de telefone deve ter no máximo 2000 caracteres.",
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
    hasFlowTemplate: z.boolean().default(false),
    flowButtons: z
      .array(
        z.object({
          order: z
            .number()
            .min(1, { message: "A ordem deve ser no mínimo 1." }),
          flowToken: z.string().max(2000, {
            message: "O flow token deve ter no máximo 2000 caracteres.",
          }),
        }),
      )
      .optional(),
  })
  .superRefine(({ hasFlowTemplate, flowButtons }, ctx) => {
    if (hasFlowTemplate) {
      if (!flowButtons || flowButtons.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["flowButtons"],
          message: "Adicione ao menos um botão com flow.",
        });
        return;
      }
      flowButtons.forEach((btn, i) => {
        if (!btn.flowToken?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["flowButtons", i, "flowToken"],
            message: "O flow token é obrigatório.",
          });
        }
      });
    }
  });
