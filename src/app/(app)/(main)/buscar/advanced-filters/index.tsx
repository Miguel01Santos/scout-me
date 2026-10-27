'use client';

import { AttributeSelect } from '@/src/app/(app)/perfil/atributos/attribute-select';
import {
  PLAYER_ATTRIBUTES_TEXT,
  PlayerCategory,
  PlayerPosition,
  PreferredFoot,
} from '@/src/core/enums/player-attributes';
import { PLAYER_LEVEL_LABEL, PlayerLevel } from '@/src/core/enums/player-level';
import { useThemeClasses } from '@/src/core/hooks/use-theme-classes';
import { useAccount } from '@/src/core/providers/account';
import { EMPTY_PLAYER_FILTERS } from '../constants';
import { AdvancedFiltersProps } from './type';

const ANY_VALUE = 'Qualquer';

export function AdvancedFilters({ value, onChange }: AdvancedFiltersProps) {
  const { configuration } = useAccount();
  const themeClasses = useThemeClasses();
  const text = PLAYER_ATTRIBUTES_TEXT[configuration.language];
  const hasFilters = Object.values(value).some(Boolean);

  return (
    <div className={`space-y-3 rounded-2xl border p-3 ${themeClasses.card}`}>
      <p className={`text-xs ${themeClasses.subText}`}>Esse filtro listará apenas contas players.</p>

      <div className="grid grid-cols-2 gap-3">
        <AttributeSelect
          label={text.position.label}
          placeholder={ANY_VALUE}
          value={value.position}
          onChange={(position) => onChange({ ...value, position })}
          options={Object.values(PlayerPosition).map((position) => ({
            value: position,
            label: text.position.values[position].full,
          }))}
        />
        <AttributeSelect
          label={text.preferredFoot.label}
          placeholder={ANY_VALUE}
          value={value.preferredFoot}
          onChange={(preferredFoot) => onChange({ ...value, preferredFoot })}
          options={Object.values(PreferredFoot).map((preferredFoot) => ({
            value: preferredFoot,
            label: text.preferredFoot.values[preferredFoot].full,
          }))}
        />
        <AttributeSelect
          label={text.category.label}
          placeholder={ANY_VALUE}
          value={value.category}
          onChange={(category) => onChange({ ...value, category })}
          options={Object.values(PlayerCategory).map((category) => ({
            value: category,
            label: text.category.values[category].full,
          }))}
        />
        <AttributeSelect
          label="Nível"
          placeholder={ANY_VALUE}
          value={value.level}
          onChange={(level) => onChange({ ...value, level })}
          options={Object.values(PlayerLevel).map((level) => ({
            value: level,
            label: PLAYER_LEVEL_LABEL[level],
          }))}
        />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_PLAYER_FILTERS)}
          className="text-xs font-bold text-indigo-500 hover:opacity-80 transition"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
