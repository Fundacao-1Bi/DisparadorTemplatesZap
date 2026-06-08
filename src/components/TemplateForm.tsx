import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formSchema } from "@/schemas/templateFormSchema";
import { useState } from "react"; // Import necessário para o estado
import { Label } from "@/components/ui/label";

const TemplateForm = ({
  onSubmit,
}: {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
      phoneNumberId: "",
      templateId: "",
      base: "",
      imageUrl: "",
      hasFlowTemplate: false,
      flowButtons: [],
    },
  });

  const [isAdditionalParamsVisible, setAdditionalParamsVisible] =
    useState(false);
  const hasFlowTemplate = form.watch("hasFlowTemplate");

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "flowButtons",
  });

  const handleButtonCountChange = (newCount: number) => {
    const currentCount = fields.length;
    if (newCount > currentCount) {
      for (let i = currentCount; i < newCount; i++) {
        append({ order: i + 1, flowToken: "" });
      }
    } else if (newCount < currentCount) {
      for (let i = currentCount - 1; i >= newCount; i--) {
        remove(i);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Campos existentes */}
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token</FormLabel>
              <FormControl>
                <Input placeholder="token" {...field} />
              </FormControl>
              <FormDescription>
                Veja como obter o token em:{" "}
                <a
                  href="https://developers.facebook.com/blog/post/2022/12/05/auth-tokens/"
                  target="_blank"
                >
                  https://developers.facebook.com/blog/post/2022/12/05/auth-tokens/
                </a>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number ID</FormLabel>
              <FormControl>
                <Input placeholder="phoneNumberId" {...field} />
              </FormControl>
              <FormDescription>
                Você pode obter na aba "Api Setup" do app na plataforma de
                developers, ao selecionar o número aparece logo embaixo "Phone
                number ID"
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template ID</FormLabel>
              <FormControl>
                <Input placeholder="templateId" {...field} />
              </FormControl>
              <FormDescription>
                O nome dado ao template ao ser cadastrado
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="base"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base</FormLabel>
              <FormControl>
                <Textarea rows={8} placeholder="base" {...field} />
              </FormControl>
              <FormDescription>
                Lista de telefones no formato 55XXXXXXXXXXX. Separados por tab,
                quebra de linha, vírgula ou ponto e vírgula
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seção expansível */}
        <div>
          <Button
            type="button"
            onClick={() =>
              setAdditionalParamsVisible(!isAdditionalParamsVisible)
            }
          >
            {isAdditionalParamsVisible ? "Recolher" : "Expandir"} Parâmetros
            adicionais
          </Button>
          {isAdditionalParamsVisible && (
            <div className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Url de imagem do header</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL de uma imagem que será usada no header do template.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasFlowTemplate"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <input
                          id="hasFlowTemplate"
                          ref={field.ref}
                          type="checkbox"
                          checked={field.value}
                          onChange={(event) => {
                            field.onChange(event.target.checked);
                            if (event.target.checked) {
                              replace([{ order: 1, flowToken: "flow_token" }]);
                            } else {
                              replace([]);
                            }
                          }}
                          className="h-4 w-4 rounded border border-input"
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <Label htmlFor="hasFlowTemplate">
                          Template com flow
                        </Label>
                        <FormDescription>
                          Adiciona o componente de botão do tipo flow no body
                          enviado para a Meta.
                        </FormDescription>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {hasFlowTemplate && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="flowButtonCount">Botões com flow</Label>
                    <input
                      id="flowButtonCount"
                      type="number"
                      min={1}
                      value={fields.length}
                      onChange={(e) =>
                        handleButtonCountChange(
                          Math.max(1, parseInt(e.target.value) || 1),
                        )
                      }
                      className="h-9 w-20 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    />
                  </div>
                  {fields.map((fieldItem, index) => (
                    <div key={fieldItem.id} className="flex items-end gap-3">
                      <FormField
                        control={form.control}
                        name={`flowButtons.${index}.order`}
                        render={({ field }) => (
                          <FormItem className="w-28">
                            <FormLabel>Ordem</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 1)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`flowButtons.${index}.flowToken`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Flow Token</FormLabel>
                            <FormControl>
                              <Input placeholder="flow_token" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
};

export default TemplateForm;
