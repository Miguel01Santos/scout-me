import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, Badge, Button, Chip, Skeleton } from "@heroui/react";
import { ModalComponent } from "../../library/modal";
import { getInitials } from "../../utils/get-initials";
import { getSession } from "../../auth";
import { getUser } from "../../api/user/service";
import { User } from "../../api/user/type";
import { ACCOUNT_TYPE_COLOR, ACCOUNT_TYPE_NAME, toAccountType } from "../../enums/account-type";
import { ShieldIcon, UserIcon } from "../../icons";
import { DialogLogout } from "../dialog-logout";
import { UserModalProps } from "./type";

const OPTION_CLASS_NAME =
  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-black transition hover:bg-black/5";

export function UserModal({ isOpen, onOpenChange }: UserModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
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
    <>
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
          <nav className="flex flex-col">
            <button type="button" className={OPTION_CLASS_NAME}>
              <span className="flex items-center gap-3">
                <span className="brightness-0">
                  <ShieldIcon />
                </span>
                Meu plano
              </span>
              <Chip className={`${ACCOUNT_TYPE_COLOR[accountType].background} text-white`}>
                {ACCOUNT_TYPE_NAME[accountType]}
              </Chip>
            </button>
            <Link href="/account" className={OPTION_CLASS_NAME}>
              <span className="flex items-center gap-3">
                <span className="brightness-0">
                  <UserIcon />
                </span>
                Minha Conta
              </span>
            </Link>
          </nav>
        }
        footer={
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center space-x-2">
              <ShieldIcon />
              <div>
                <p className="font-black text-sm tracking-wide bg-gradient-to-r from-amber-400 to-indigo-500 bg-clip-text text-transparent">
                  ScoutMe PRO
                </p>
                <p className="text-[10px] text-slate-400">Scouting de base</p>
              </div>
            </div>
            <Button variant="danger-soft" fullWidth onPress={() => setIsLogoutOpen(true)}>
              Sair
            </Button>
          </div>
        }
      />

      <DialogLogout isOpen={isLogoutOpen} onOpenChange={setIsLogoutOpen} />
    </>
  );
}
