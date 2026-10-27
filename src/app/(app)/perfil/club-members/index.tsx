'use client';

import { useEffect, useState } from 'react';
import { getClubMembers } from '@/src/core/api/clubs/service';
import { ClubMembers } from '@/src/core/api/clubs/type';
import { getSession } from '@/src/core/auth';
import { ProfileResult } from '@/src/core/components/profile-result';
import { ProfileResultsSkeleton } from '@/src/core/components/profile-results-skeleton';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { ClubMembersSectionProps } from './type';

export function ClubMembersSection({ username }: ClubMembersSectionProps) {
  const themeClasses = useThemeClasses();
  const [members, setMembers] = useState<ClubMembers | null>(null);

  useEffect(() => {
    const session = getSession();

    if (!session) return;

    getClubMembers(session.accessToken, username)
      .then(setMembers)
      .catch(() => setMembers({ athletes: [], scouts: [] }));
  }, [username]);

  if (!members) return <ProfileResultsSkeleton />;

  const sections = [
    { title: 'Atletas', profiles: members.athletes, empty: 'Nenhum atleta no clube ainda.' },
    { title: 'Scouts', profiles: members.scouts, empty: 'Nenhum scout no clube ainda.' },
  ];

  return (
    <>
      {sections.map((section) => (
        <section key={section.title} className="space-y-2">
          <h3 className="m-0 text-sm font-black">{section.title}</h3>
          {section.profiles.length === 0 ? (
            <p className={`text-sm italic ${themeClasses.subText}`}>{section.empty}</p>
          ) : (
            <div className="space-y-2">
              {section.profiles.map((profile) => (
                <ProfileResult key={profile.username} profile={profile} />
              ))}
            </div>
          )}
        </section>
      ))}
    </>
  );
}
