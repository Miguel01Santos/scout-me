// Cookie só com o estado da navegação, sem token nenhum: o proxy.ts lê para mandar direto
// para a tela certa antes de renderizar. Quem confere a sessão de verdade continua sendo a API.
export const SESSION_STATE_COOKIE = 'scoutme_session_state';

export enum SessionState {
  READY = 'ready',
  PENDING_ACCOUNT_TYPE = 'pending-account-type',
}
