import { Drawer, Separator } from "@heroui/react";
import { ModalComponentProps } from "./type";

export function ModalComponent({
  isOpen,
  onOpenChange,
  header,
  body,
  footer,
}: ModalComponentProps) {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.Header className="flex flex-row items-center space-x-1">
              {header}
            </Drawer.Header>
            <Separator className="my-4" />
            <Drawer.Body>{body}</Drawer.Body>
            <Drawer.Footer>{footer}</Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
