import { ChartColumn, Newspaper, Users } from 'lucide-react';
import { HomeScreen, NaviBarProps } from './type';

const SCREENS: { value: HomeScreen; label: string; icon: typeof Users }[] = [
  { value: 'ranking', label: 'Atletas', icon: Users },
  { value: 'comparar', label: 'Comparador', icon: ChartColumn },
  { value: 'feed', label: 'Feed', icon: Newspaper },
];

export function NaviBar({ screen, setCurrentScreen }: NaviBarProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {SCREENS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setCurrentScreen(value)}
          className={`flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-bold transition ${
            screen === value ? 'bg-indigo-600 text-white shadow-md' : 'border'
          }`}
        >
          <Icon size={14} /> <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
