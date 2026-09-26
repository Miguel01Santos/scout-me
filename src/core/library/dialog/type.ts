import { ReactNode } from "react";

export interface DialogComponentProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  body: ReactNode;
  footer: ReactNode;
}
