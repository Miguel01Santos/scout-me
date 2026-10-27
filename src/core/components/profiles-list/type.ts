import { ProfileCard } from '../../api/profiles/type';

export interface ProfilesListProps {
  load: (accessToken: string) => Promise<{ profiles: ProfileCard[] }>;
  emptyMessage: string;
}
