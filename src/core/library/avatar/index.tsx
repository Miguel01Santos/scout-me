import { useState } from "react";
import { Avatar, Badge } from "@heroui/react";
import { UserAvatarProps } from "./type";
import { getInitials } from "../../utils/get-initials";
import { ModalComponent } from "../modal";

export function AvatarComponent({ name, avatarUrl }: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Badge.Anchor
        onClick={() => setIsOpen(true)}
        className="ring-2 ring-emerald-500 rounded-full cursor-pointer"
      >
        <Avatar>
          <Avatar.Image alt={name} src={avatarUrl} />
          <Avatar.Fallback>{getInitials(name)}</Avatar.Fallback>
        </Avatar>
      </Badge.Anchor>

      <ModalComponent isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
