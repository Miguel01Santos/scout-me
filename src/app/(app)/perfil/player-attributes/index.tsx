'use client';

import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { PLAYER_ATTRIBUTES_TEXT } from '@/src/core/enums/player-attributes';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { AttributePill } from '../attribute-pill';
import { AttributePillProps } from '../attribute-pill/type';
import { PlayerAttributesSectionProps } from './type';

const EDIT_HREF = '/perfil/atributos';

export function PlayerAttributesSection({
  attributes,
  language,
  isEditable = false,
}: PlayerAttributesSectionProps) {
  const text = PLAYER_ATTRIBUTES_TEXT[language];
  const themeClasses = useThemeClasses();
  const pills: (AttributePillProps & { key: string })[] = [];

  // A posição vem primeiro: é o que mais identifica o atleta.
  if (attributes.position) {
    pills.push({
      key: 'position',
      label: text.position.label,
      ...text.position.values[attributes.position],
    });
  }
  if (attributes.preferredFoot) {
    pills.push({
      key: 'preferredFoot',
      label: text.preferredFoot.label,
      ...text.preferredFoot.values[attributes.preferredFoot],
    });
  }
  if (attributes.category) {
    pills.push({
      key: 'category',
      label: text.category.label,
      ...text.category.values[attributes.category],
    });
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="m-0 text-sm font-black">{text.title}</h3>
        {isEditable && pills.length > 0 && (
          <Link
            href={EDIT_HREF}
            aria-label={text.edit}
            className={`p-1 rounded-lg opacity-70 hover:opacity-100 transition ${themeClasses.subText}`}
          >
            <Pencil size={14} />
          </Link>
        )}
      </div>

      {pills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {pills.map(({ key, ...pill }) => (
            <AttributePill key={key} {...pill} />
          ))}
        </div>
      ) : isEditable ? (
        <Link
          href={EDIT_HREF}
          className={`text-sm italic underline-offset-2 hover:underline ${themeClasses.subText}`}
        >
          {text.empty}
        </Link>
      ) : (
        <p className={`text-sm italic ${themeClasses.subText}`}>{text.empty}</p>
      )}
    </section>
  );
}
