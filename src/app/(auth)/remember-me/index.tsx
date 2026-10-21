'use client';

import { Checkbox, Label } from '@heroui/react';
import { RememberMeProps } from './type';

export function RememberMe({ isSelected, onChange }: RememberMeProps) {
  return (
    <Checkbox
      isSelected={isSelected}
      onChange={onChange}
      className="[--accent:var(--color-indigo-600)] [--accent-foreground:var(--color-white)]"
    >
      <Checkbox.Content>
        <Checkbox.Control className="border border-slate-600 bg-transparent in-data-[selected=true]:border-indigo-600">
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Label className="text-[11px] text-slate-400">Lembre-me</Label>
      </Checkbox.Content>
    </Checkbox>
  );
}
