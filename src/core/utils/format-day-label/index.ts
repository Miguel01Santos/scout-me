const DAY_IN_MS = 24 * 60 * 60 * 1000;

const sameYearFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const otherYearFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function dayKey(date: string | Date) {
  return new Date(startOfDay(new Date(date))).toISOString();
}

export function formatDayLabel(date: string | Date, now = new Date()) {
  const day = new Date(date);
  const daysAgo = Math.round((startOfDay(now) - startOfDay(day)) / DAY_IN_MS);

  if (daysAgo === 0) return 'Hoje';
  if (daysAgo === 1) return 'Ontem';

  const formatter = day.getFullYear() === now.getFullYear() ? sameYearFormatter : otherYearFormatter;
  const label = formatter.format(day);

  return label.charAt(0).toUpperCase() + label.slice(1);
}
