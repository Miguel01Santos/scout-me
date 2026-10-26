export interface DialogUnfollowProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  name: string;
  isPrivate: boolean;
  onConfirm: () => void;
}
