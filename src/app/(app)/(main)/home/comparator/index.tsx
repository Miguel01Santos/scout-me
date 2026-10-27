'use client';

import { useState } from 'react';
import { HeadToHeadTab } from '../head-to-head-tab';
import { McdmRankTab } from '../mcdm-rank-tab';
import { TacticalBlueprintTab } from '../tactical-blueprint-tab';
import { ComparatorProps, ComparatorTab } from './type';

const TABS: { value: ComparatorTab; label: string }[] = [
  { value: 'fit', label: 'Blueprint Tático' },
  { value: 'h2h', label: 'Head-to-Head' },
  { value: 'mcdm', label: 'Rank MCDM' },
];

export function Comparator({ athletes, onSelect }: ComparatorProps) {
  const [activeTab, setActiveTab] = useState<ComparatorTab>('fit');

  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-700/40 text-xs">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`border-b-2 px-3 py-2 font-bold transition ${
              activeTab === tab.value
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'fit' && <TacticalBlueprintTab athletes={athletes} onSelect={onSelect} />}
      {activeTab === 'h2h' && <HeadToHeadTab athletes={athletes} />}
      {activeTab === 'mcdm' && <McdmRankTab athletes={athletes} onSelect={onSelect} />}
    </div>
  );
}
