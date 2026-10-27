export type HomeScreen = 'ranking' | 'comparar' | 'feed';

export interface NaviBarProps {
  screen: HomeScreen;
  setCurrentScreen: (screen: HomeScreen) => void;
}
