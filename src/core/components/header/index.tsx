'use client';

import { LogOutIcon, MoonIcon, ShieldIcon, SunIcon } from "../../icons";
import { HeaderProps } from "./type";

export function Header({
  user, theme, modeTheme, onChange, onLogout
}: HeaderProps) {

  return (
    <header
      className={`p-4 border rounded-2xl flex justify-between items-center ${theme.card}`}
    >
      <div className="flex items-center space-x-2">
        <ShieldIcon />
        <div>
          <h1 className="font-black text-sm tracking-wide bg-gradient-to-r from-amber-400 to-indigo-500 bg-clip-text text-transparent">
            ScoutMe PRO
          </h1>
          <p className={`text-[10px] ${theme.subText}`}>
            Perfil: {user.nome} (Peso {user.peso})
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onChange(!modeTheme)}
          className="p-2 border rounded-xl hover:opacity-80 transition"
        >
          {modeTheme ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          onClick={onLogout}
          title="Sair"
          className="p-2 border rounded-xl hover:opacity-80 transition"
        >
          <LogOutIcon />
        </button>
      </div>
    </header>
  )
}
