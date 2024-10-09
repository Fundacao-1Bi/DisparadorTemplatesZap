import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TriggerState } from "@/interfaces/TriggerState";

const FeedbackModal = ({
  isOpen,
  onClose,
  triggerState,
}: {
  isOpen: boolean;
  onClose: () => void;
  triggerState: TriggerState;
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviando templates</DialogTitle>
          <DialogDescription>
            <h3 className="mt-2">
              {triggerState.currentIndex} de {triggerState.total} enviados
            </h3>
            {triggerState.failureCount > 0 && (
              <div className="mt-4">
                <h4>Taxa de falha:</h4>
                <p className="mt-1">
                  {triggerState.currentIndex - triggerState.failureCount}{" "}
                  envio(s) com sucesso
                </p>
                <p className="mt-1">{triggerState.failureCount} falha(s)</p>
              </div>
            )}
            <div className="mt-4">
              <h4>Status do último envio: </h4>
              <p>telefone: {triggerState.number}</p>
              <p>Mensagem: {triggerState.message}</p>
            </div>
            {triggerState.currentIndex >= triggerState.total && (
              <div className="flex justify-end mt-4">
                <Button onClick={onClose}>Fechar</Button>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default FeedbackModal;
