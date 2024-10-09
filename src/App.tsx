import "./App.css";
import { z } from "zod";

import React from "react";
import sendToMeta from "./service/sendToMeta";

import { formSchema } from "@/schemas/templateFormSchema";
import TemplateForm from "./components/TemplateForm";
import { TriggerState } from "./interfaces/TriggerState";
import FeedbackModal from "./components/FeedbackModal";

function App() {
  const [triggerState, setTriggerState] = React.useState<TriggerState>({
    currentIndex: 0,
    total: 0,
    failureCount: 0,
    message: "",
    number: "",
  });

  const [openModal, setOpenModal] = React.useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const numberList = values.base
      .split(/[\n\t;,]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 5);
    const total = numberList.length;
    const { token, phoneNumberId, templateId } = values;
    setOpenModal(true);

    for (const number of numberList) {
      try {
        await sendToMeta({
          number,
          token,
          templateId,
          phoneNumberId,
        });
        setTriggerState((state) => ({
          ...state,
          total,
          currentIndex: state.currentIndex + 1,
          number,
          message: "Enviado com sucesso",
        }));
      } catch (e: unknown) {
        console.error(e);
        setTriggerState((state) => ({
          ...state,
          total,
          currentIndex: state.currentIndex + 1,
          failureCount: state.failureCount + 1,
          number,
          message: e instanceof Error ? e.message : "Erro desconhecido",
        }));
      }
    }
  };

  return (
    <main>
      <h1 className="mb-16">Disparador de Templates ZAP</h1>
      <TemplateForm onSubmit={onSubmit} />
      <FeedbackModal
        isOpen={openModal}
        onClose={() => {
          setTriggerState({
            currentIndex: 0,
            total: 0,
            failureCount: 0,
            message: "",
            number: "",
          });
          setOpenModal(false);
        }}
        triggerState={triggerState}
      />
    </main>
  );
}

export default App;
