import { User } from '@/src/core/api/user/type';

export interface ProfileFieldsProps {
  user: Pick<User, 'name' | 'email'>;
}
