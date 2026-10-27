'use client';

import { Label, Switch } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { PrivacySwitchProps } from './type';

export function PrivacySwitch({
  label,
  description,
  isSelected,
  isDisabled,
  errorMessage,
  onChange,
}: PrivacySwitchProps) {
  const themeClasses = useThemeClasses();

  return (
    <section className={`p-4 border rounded-2xl space-y-3 ${themeClasses.card}`}>
      {errorMessage && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] font-semibold text-rose-400">
          {errorMessage}
        </p>
      )}

      <Switch
        className="w-full justify-between"
        isSelected={isSelected}
        isDisabled={isDisabled}
        onChange={onChange}
      >
        <Switch.Content className="w-full justify-between text-inherit!">
          <span className="flex flex-col gap-1">
            <Label className="text-sm font-black text-inherit!">{label}</Label>
            <span className={`text-[11px] ${themeClasses.subText}`}>{description}</span>
          </span>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
    </section>
  );
}
