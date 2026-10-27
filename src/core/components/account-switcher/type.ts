import { SavedSessionProfile } from '../../auth/type';

export interface AccountSwitcherProps {
  currentProfile: SavedSessionProfile | null;
  onLeave: () => void;
}
