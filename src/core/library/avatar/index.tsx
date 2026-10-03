import { useState } from "react";
import { Badge } from "@heroui/react";
import { UserAvatarProps } from "./type";
import { UserAvatar } from "../../components/user-avatar";
import { UserModal } from "../../components/user-modal";
import { ACCOUNT_TYPE_COLOR, toAccountType } from "../../enums/account-type";

export function AvatarComponent({ name, avatarUrl, accountType }: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Badge.Anchor
        onClick={() => setIsOpen(true)}
        className={`ring-2 ${ACCOUNT_TYPE_COLOR[toAccountType(accountType)].ring} rounded-full cursor-pointer`}
      >
        <UserAvatar name={name} avatarUrl={avatarUrl} size="sm" />
      </Badge.Anchor>

      <UserModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
