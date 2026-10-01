import { CSSProperties } from "react";
import { Drawer, Separator } from "@heroui/react";
import { ModalComponentProps } from "./type";

// Fechamento mais lento que o padrão do HeroUI (200ms).
export const DRAWER_EXIT_DURATION_MS = 500;

const EXIT_ANIMATION_STYLE = {
  '--drawer-exit-duration': `${DRAWER_EXIT_DURATION_MS}ms`,
} as CSSProperties;

export function ModalComponent({
  isOpen,
  onOpenChange,
  header,
  body,
  footer,
  className,
}: ModalComponentProps) {
  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Backdrop className="data-[exiting=true]:duration-500">
        <Drawer.Content placement="left">
          <Drawer.Dialog style={EXIT_ANIMATION_STYLE} className={className}>
            <Drawer.Header className="flex flex-row items-center space-x-1">
              {header}
            </Drawer.Header>
            <Separator className="my-4" />
            <Drawer.Body>{body}</Drawer.Body>
            {footer && (
              <>
                <Separator className="my-4" />
                <Drawer.Footer>{footer}</Drawer.Footer>
              </>
            )}
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
