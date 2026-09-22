interface user {
  nome: string;
  peso: number;
}

interface theme {
  card: string;
  subText: string;
}

export interface HeaderProps {
  user: user;
  theme: theme;
  modeTheme: boolean;
  onChange: (darkMode: boolean) => void;
  onLogout: () => void;
}
