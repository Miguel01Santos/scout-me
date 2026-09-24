import { useEffect, useState } from "react";
import { Avatar, Badge, Button, Skeleton } from "@heroui/react";
import { ModalComponent } from "../../library/modal";
import { getInitials } from "../../utils/get-initials";
import { getSession } from "../../auth";
import { getUser } from "../../api/user/service";
import { User } from "../../api/user/type";
import { UserModalProps } from "./type";

export function UserModal({ isOpen, onOpenChange }: UserModalProps) {
  const [user, setUser] = useState<User | null>(null);

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
        <p>
          This is a bottom drawer built with React Modal component. It slides up from
          the bottom of the screen with a smooth CSS transition.
        </p>
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
