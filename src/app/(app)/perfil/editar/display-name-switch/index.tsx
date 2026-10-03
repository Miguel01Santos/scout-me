'use client';

import { Label, Switch } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { DisplayNameSwitchProps } from '../type';

export function DisplayNameSwitch({
  isSelected,
  displayName,
  userName,
  onChange,
}: DisplayNameSwitchProps) {
  const themeClasses = useThemeClasses();

  return (
    <Switch className="w-full" isSelected={isSelected} onChange={onChange}>
      <Switch.Content className="w-full justify-between text-inherit!">
        <span className="flex flex-col gap-1">
          <Label className="text-xs font-bold text-inherit!">Mostrar nome do perfil</Label>
          <span className={`text-[11px] ${themeClasses.subText}`}>
            {isSelected
              ? `Seu perfil mostra "${displayName}".`
              : `Seu perfil mostra o nome de usuário ("${userName}").`}
          </span>
        </span>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Content>
    </Switch>
  );
}
