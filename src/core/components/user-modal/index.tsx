import { useEffect, useState } from "react";
import { Avatar, Badge, Button, Chip, Skeleton } from "@heroui/react";
import { ModalComponent } from "../../library/modal";
import { getInitials } from "../../utils/get-initials";
import { getSession } from "../../auth";
import { getUser } from "../../api/user/service";
import { User } from "../../api/user/type";
import { ACCOUNT_TYPE_COLOR, ACCOUNT_TYPE_NAME, toAccountType } from "../../enums/account-type";
import { UserModalProps } from "./type";

export function UserModal({ isOpen, onOpenChange }: UserModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const accountType = toAccountType(user?.account?.type);

  async function initialize() {
    const session = getSession();

    if (!session) return;

    try {
      const { user: fetchedUser } = await getUser(session.accessToken);

      setUser(fetchedUser);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    if (isOpen) initialize();
  }, [isOpen]);

  return (
    <ModalComponent
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      header={
        !user ? (
          <>
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <Badge.Anchor>
              <Avatar>
                <Avatar.Image alt={user.name} src={user.avatarUrl ?? undefined} />
                <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
              </Avatar>
            </Badge.Anchor>
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
            </div>
          </>
        )
      }
      body={
        <Button variant="tertiary" fullWidth className="justify-between text-black">
          Meu plano
          <Chip className={`${ACCOUNT_TYPE_COLOR[accountType].background} text-white`}>
            {ACCOUNT_TYPE_NAME[accountType]}
          </Chip>
        </Button>
      }
      footer={
        <>
          <Button slot="close" variant="secondary">
            Cancel
          </Button>
          <Button slot="close">Confirm</Button>
        </>
      }
    />
  );
}
