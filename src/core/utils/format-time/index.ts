const formatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function formatTime(date: string | Date) {
  return formatter.format(new Date(date));
}
