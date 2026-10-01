import { ChartColumn, Users } from "lucide-react";
import { NaviBarProps } from "./type";

export function NaviBar({ screen, setCurrentScreen }: NaviBarProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => setCurrentScreen('ranking')}
        className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
          screen === 'ranking'
            ? 'bg-indigo-600 text-white shadow-md'
            : 'border'
        }`}
      >
        <Users size={14} /> <span>Atletas</span>
      </button>
      <button
        onClick={() => setCurrentScreen('comparar')}
        className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
          screen === 'comparar'
            ? 'bg-indigo-600 text-white shadow-md'
            : 'border'
        }`}
      >
        <ChartColumn size={14} /> <span>Comparador</span>
      </button>
    </div>
  )
}
