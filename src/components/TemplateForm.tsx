import { z } from "zod";
import { useForm } from "react-hook-form";
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
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
};

export default TemplateForm;
