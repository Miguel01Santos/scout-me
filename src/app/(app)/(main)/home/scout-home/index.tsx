'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@heroui/react';
import { ApiError } from '@/src/core/api';
import { getScoutingAthletes } from '@/src/core/api/scouting/service';
import { ScoutingAthlete } from '@/src/core/api/scouting/type';
import { getSession } from '@/src/core/auth';
import { NaviBar } from '@/src/core/components/navibar';
import { HomeScreen } from '@/src/core/components/navibar/type';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { AthletesList } from '../athletes-list';
import { Comparator } from '../comparator';
import { Feed } from '../feed';

export function ScoutHome() {
  const router = useRouter();
  const themeClasses = useThemeClasses();
  const [screen, setScreen] = useState<HomeScreen>('ranking');
  const [athletes, setAthletes] = useState<ScoutingAthlete[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getScoutingAthletes(session.accessToken)
      .then(({ athletes: loadedAthletes }) => setAthletes(loadedAthletes))
      .catch((error) => {
        setErrorMessage(error instanceof ApiError ? error.message : 'Não foi possível carregar os atletas.');
        setAthletes([]);
      });
  }, []);

  function openAthlete(username: string) {
    router.push(`/perfil/${username}`);
  }

  function renderAthletesScreen() {
    if (!athletes) {
      return (
        <div className="space-y-2.5">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className={`h-20 w-full rounded-2xl ${themeClasses.skeleton}`} />
          ))}
        </div>
      );
    }

    if (errorMessage) {
      return (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      );
    }

    if (athletes.length === 0) {
      return (
        <div className={`space-y-2 rounded-2xl border p-4 text-center ${themeClasses.card}`}>
          <p className="text-sm font-bold">Você ainda não segue nenhum player</p>
          <p className={`text-xs ${themeClasses.subText}`}>
            Os atletas que você segue aparecem aqui, com overall, critérios e comparações.
          </p>
          <Link href="/buscar" className="inline-block text-xs font-bold text-indigo-500">
            Encontrar atletas no Descobrir
          </Link>
        </div>
      );
    }

    return screen === 'ranking' ? (
      <AthletesList athletes={athletes} onSelect={openAthlete} />
    ) : (
      <Comparator athletes={athletes} onSelect={openAthlete} />
    );
  }

  return (
    <div className="space-y-4">
      <NaviBar screen={screen} setCurrentScreen={setScreen} />
      {screen === 'feed' ? <Feed /> : renderAthletesScreen()}
    </div>
  );
}
