import { NextRequest, NextResponse } from 'next/server';
import { SESSION_STATE_COOKIE, SessionState } from './core/enums/session-state';

const GUEST_PAGES = ['/login', '/registro'];
const ACCOUNT_TYPE_PAGE = '/tipo-de-conta';

// Decide a tela antes de renderizar, pelo cookie de estado da sessão, para não aparecer uma
// página e logo depois outra. É só navegação: as páginas continuam conferindo a sessão.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const state = request.cookies.get(SESSION_STATE_COOKIE)?.value;
  // O Host do pedido, e não o nextUrl: em dev o nextUrl vem como localhost mesmo em 127.0.0.1.
  const hostname = (request.headers.get('host') ?? '').split(':')[0];
  const destination = destinationFor(pathname, state, hostname);

  if (!destination || destination === pathname) return NextResponse.next();

  return NextResponse.redirect(new URL(destination, request.url));
}

function destinationFor(pathname: string, state: string | undefined, hostname: string) {
  if (GUEST_PAGES.includes(pathname)) {
    if (state === SessionState.READY) return '/home';
    if (state === SessionState.PENDING_ACCOUNT_TYPE) return ACCOUNT_TYPE_PAGE;

    return null;
  }

  if (pathname === ACCOUNT_TYPE_PAGE) {
    if (state === SessionState.READY) return '/home';

    return state ? null : '/login';
  }

  if (state === SessionState.PENDING_ACCOUNT_TYPE) return ACCOUNT_TYPE_PAGE;
  // Em localhost o app entra sozinho com o usuário de desenvolvimento (ver ensureSession).
  if (!state && hostname !== 'localhost') return '/login';

  return null;
}

export const config = {
  // Só páginas: ficam de fora o proxy da API (/api), os arquivos do Next e tudo que tem extensão.
  matcher: ['/((?!api/|_next/|.*\\..*).*)', '/perfil/:username'],
};
