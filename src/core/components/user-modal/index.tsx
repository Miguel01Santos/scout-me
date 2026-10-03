import { MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings, ShieldCheck } from "lucide-react";
import { Badge, Chip, Skeleton } from "@heroui/react";
import { DRAWER_EXIT_DURATION_MS, ModalComponent } from "../../library/modal";
import { UserAvatar } from "../user-avatar";
import { getSession } from "../../auth";
import { getUser } from "../../api/user/service";
import { User } from "../../api/user/type";
import { ACCOUNT_TYPE_COLOR, ACCOUNT_TYPE_NAME, toAccountType } from "../../enums/account-type";
import { useThemeClasses } from "../../hooks/use-theme-classes";
import { ShieldIcon } from "../../icons";
import { UserModalProps } from "./type";

const OPTION_CLASS_NAME =
  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-default";

export function UserModal({ isOpen, onOpenChange }: UserModalProps) {
  const router = useRouter();
  const themeClasses = useThemeClasses();
  const [user, setUser] = useState<User | null>(null);
  const accountType = toAccountType(user?.account?.type);

  function navigateAfterClose(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    onOpenChange(false);
    setTimeout(() => router.push(href), DRAWER_EXIT_DURATION_MS);
  }

  useEffect(() => {
    if (!isOpen) return;

    const session = getSession();

    if (!session) return;

    getUser(session.accessToken)
      .then(({ user: fetchedUser }) => setUser(fetchedUser))
      .catch(() => setUser(null));
  }, [isOpen]);

  return (
    <>
      <ModalComponent
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className={themeClasses.bg}
        header={
          !user ? (
            <>
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <Link
              href="/perfil"
              onClick={(event) => navigateAfterClose(event, "/perfil")}
              className="flex items-center gap-3"
            >
              <Badge.Anchor>
                <UserAvatar name={user.name} avatarUrl={user.avatarUrl} size="md" />
              </Badge.Anchor>
              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-xs text-muted">Meu perfil</p>
              </div>
            </Link>
          )
        }
        body={
          <nav className="flex flex-col">
            <button type="button" className={OPTION_CLASS_NAME}>
              <span className="flex items-center gap-3">
                <ShieldCheck size={18} />
                Meu plano
              </span>
              <Chip className={`${ACCOUNT_TYPE_COLOR[accountType].background} text-white`}>
                {ACCOUNT_TYPE_NAME[accountType]}
              </Chip>
            </button>
            <Link
              href="/configuracoes-e-privacidade"
              className={OPTION_CLASS_NAME}
              onClick={(event) => navigateAfterClose(event, "/configuracoes-e-privacidade")}
            >
              <span className="flex items-center gap-3">
                <Settings size={18} />
                Configurações e privacidade
              </span>
            </Link>
          </nav>
        }
        footer={
          <div className="flex items-center space-x-2">
            <ShieldIcon />
            <div>
              <p className="font-black text-sm tracking-wide bg-gradient-to-r from-amber-400 to-indigo-500 bg-clip-text text-transparent">
                ScoutMe PRO
              </p>
              <p className="text-[10px] text-slate-400">Scouting de base</p>
            </div>
          </div>
        }
      />
    </>
  );
}
