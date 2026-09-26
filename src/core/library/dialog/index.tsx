import { AlertDialog } from "@heroui/react";
import { DialogComponentProps } from "./type";

export function DialogComponent({
  isOpen,
  onOpenChange,
  title,
  body,
  footer,
}: DialogComponentProps) {
  return (
    <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>{body}</AlertDialog.Body>
            <AlertDialog.Footer>{footer}</AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
