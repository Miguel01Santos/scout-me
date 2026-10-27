'use client';

import { useEffect, useState } from 'react';
import { Button, toast } from '@heroui/react';
import { ApiError } from '@/src/core/api';
import {
  acceptClubInvite,
  declineClubInvite,
  getMyClub,
  leaveClub,
} from '@/src/core/api/clubs/service';
import { MyClub } from '@/src/core/api/clubs/type';
import { getSession } from '@/src/core/auth';
import { ProfileResult } from '@/src/core/components/profile-result';
import { ProfileResultsSkeleton } from '@/src/core/components/profile-results-skeleton';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { DialogComponent } from '@/src/core/library/dialog';
import { formatDayLabel } from '@/src/core/utils/format-day-label';

export function MyClubSection() {
  const themeClasses = useThemeClasses();
  const [myClub, setMyClub] = useState<MyClub | null>(null);
  const [busyUsername, setBusyUsername] = useState<string | null>(null);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getMyClub(session.accessToken)
      .then(setMyClub)
      .catch(() => setMyClub({ club: null, invites: [] }));
  }, []);

  async function run(username: string, action: (accessToken: string) => Promise<MyClub>, message: string) {
    const session = getSession();

    if (!session) return;

    setBusyUsername(username);

    try {
      setMyClub(await action(session.accessToken));
      setIsLeaveOpen(false);
      toast.success(message);
    } catch (error) {
      toast.danger(error instanceof ApiError ? error.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setBusyUsername(null);
    }
  }

  if (!myClub) return <ProfileResultsSkeleton />;

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <h2 className="text-[10px] font-bold uppercase text-slate-400">Seu clube</h2>
        {myClub.club ? (
          <>
            <ProfileResult profile={myClub.club} />
            <button
              type="button"
              onClick={() => setIsLeaveOpen(true)}
              className="text-xs font-bold text-rose-400"
            >
              Sair do clube
            </button>
          </>
        ) : (
          <p className={`text-sm italic ${themeClasses.subText}`}>
            Você não está em nenhum clube. Quando um time convidar você, o convite aparece aqui.
          </p>
        )}
      </section>

      {myClub.invites.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-[10px] font-bold uppercase text-slate-400">Convites</h2>
          {myClub.club && (
            <p className={`text-xs ${themeClasses.subText}`}>Ao aceitar um convite, você sai do clube atual.</p>
          )}
          {myClub.invites.map(({ club, invitedAt }) => (
            <div key={club.username} className={`space-y-2 rounded-2xl border p-3 ${themeClasses.card}`}>
              <ProfileResult profile={club} />
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] ${themeClasses.subText}`}>{formatDayLabel(invitedAt)}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyUsername === club.username}
                    onClick={() =>
                      run(club.username, (token) => acceptClubInvite(token, club.username), 'Você entrou no clube')
                    }
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition enabled:hover:bg-indigo-500 disabled:opacity-50"
                  >
                    Aceitar
                  </button>
                  <button
                    type="button"
                    disabled={busyUsername === club.username}
                    onClick={() =>
                      run(club.username, (token) => declineClubInvite(token, club.username), 'Convite recusado')
                    }
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition enabled:hover:opacity-80 disabled:opacity-50 ${themeClasses.subText}`}
                  >
                    Recusar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      <DialogComponent
        isOpen={isLeaveOpen}
        onOpenChange={setIsLeaveOpen}
        className={themeClasses.bg}
        title="Sair do clube?"
        body={<p>Você deixa de aparecer na lista do clube. Para voltar, o time precisa convidar você de novo.</p>}
        footer={
          <>
            <Button slot="close" variant="tertiary">
              Cancelar
            </Button>
            <Button
              variant="danger"
              isDisabled={busyUsername !== null}
              onPress={() => myClub.club && run(myClub.club.username, leaveClub, 'Você saiu do clube')}
            >
              Sair
            </Button>
          </>
        }
      />
    </div>
  );
}
