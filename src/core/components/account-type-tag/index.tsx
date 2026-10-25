import { ACCOUNT_TYPE_COLOR, ACCOUNT_TYPE_NAME } from '../../enums/account-type';
import { AccountTypeTagProps } from './type';

// Só identifica o tipo do perfil, com a mesma cor do anel do avatar.
export function AccountTypeTag({ type }: AccountTypeTagProps) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${ACCOUNT_TYPE_COLOR[type].background}`}
    >
      {ACCOUNT_TYPE_NAME[type]}
    </span>
  );
}
