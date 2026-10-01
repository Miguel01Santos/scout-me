'use client';

import { useSession } from "../../auth/use-session";
import { AvatarComponent } from "../../library/avatar";

export function Header() {
  const { user } = useSession();

  return (
    <div className="flex items-center gap-3">
      <AvatarComponent name={user?.name ?? ''} accountType={user?.account?.type} />
    </div>
  );
}
