import { useState } from "react";
import { Avatar, Badge } from "@heroui/react";
import { UserAvatarProps } from "./type";
import { getInitials } from "../../utils/get-initials";
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
        <Avatar>
          <Avatar.Image alt={name} src={avatarUrl} />
          <Avatar.Fallback>{getInitials(name)}</Avatar.Fallback>
        </Avatar>
      </Badge.Anchor>

      <UserModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
