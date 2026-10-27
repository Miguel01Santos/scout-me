import { ProfileCard } from '../../api/profiles/type';

export interface ProfileResultProps {
  profile: ProfileCard;
  onSelect?: () => void;
  onRemove?: () => void;
}
