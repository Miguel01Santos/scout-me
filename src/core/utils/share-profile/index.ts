import { toast } from '@heroui/react';
import { ShareProfileInput } from './type';

const APP_NAME = 'ScoutMe PRO';

function copyWithSelection(text: string) {
  const field = document.createElement('textarea');

  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();

  const isCopied = document.execCommand('copy');

  field.remove();

  return isCopied;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return copyWithSelection(text);
  }
}

export async function shareProfile({ name, username }: ShareProfileInput) {
  const url = `${window.location.origin}/perfil/${username}`;

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: APP_NAME,
        text: `Veja o perfil de ${name} (@${username}) no ${APP_NAME}`,
        url,
      });
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  }

  if (await copyText(url)) {
    toast.success('Link do perfil copiado');
    return;
  }

  toast.danger('Não foi possível copiar o link. Tente novamente.');
}
