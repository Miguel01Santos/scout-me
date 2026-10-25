'use client';

import { Label, ListBox, Select } from '@heroui/react';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { AttributeSelectProps } from './type';

// Mesmo visual dos campos da edição de perfil. O "x" limpa o atributo (vai null para a API).
export function AttributeSelect<T extends string>({
  label,
  placeholder,
  value,
  options,
  isDisabled,
  onChange,
}: AttributeSelectProps<T>) {
  const themeClasses = useThemeClasses();

  return (
    <Select
      fullWidth
      className="gap-1"
      placeholder={placeholder}
      value={value}
      onChange={(key) => onChange((key as T | null) ?? null)}
      isDisabled={isDisabled}
    >
      <Label className="block text-[10px] uppercase font-bold text-slate-400">{label}</Label>
      <Select.Trigger
        // pr-9: a seta do HeroUI fica em posição absoluta à direita e precisa desse espaço livre.
        className={`w-full min-h-0 rounded-xl border p-2.5 pr-9 text-xs shadow-none ${themeClasses.input}`}
      >
        <Select.Value className="text-xs" />
        <Select.ClearButton />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
