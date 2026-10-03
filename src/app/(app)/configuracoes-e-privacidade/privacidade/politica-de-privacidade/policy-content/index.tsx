'use client';

import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { POLICY_INTRO, POLICY_SECTIONS, POLICY_UPDATED_AT } from '../constants';

export function PolicyContent() {
  const themeClasses = useThemeClasses();

  return (
    <article className={`p-4 border rounded-2xl space-y-5 ${themeClasses.card}`}>
      <div className="space-y-2">
        <p className={`text-[11px] ${themeClasses.subText}`}>Última atualização: {POLICY_UPDATED_AT}</p>
        <p className="text-xs leading-relaxed">{POLICY_INTRO}</p>
      </div>

      {POLICY_SECTIONS.map((section) => (
        <section key={section.title} className="space-y-2">
          <h2 className="text-sm font-black m-0">{section.title}</h2>

          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="text-xs leading-relaxed">
              {paragraph}
            </p>
          ))}

          {section.items && (
            <ul className="list-disc pl-4 space-y-1.5 text-xs leading-relaxed">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}
