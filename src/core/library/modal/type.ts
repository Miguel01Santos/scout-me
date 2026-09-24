import { ReactNode } from "react";

export interface ModalComponentProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  header: ReactNode;
  body: ReactNode;
  footer: ReactNode;
}
