export const formatTime = (timestampSeconds: number, lang = 'ru'): string => {
  const date = new Date(timestampSeconds * 1000);
  return date.toLocaleTimeString(lang, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const dayKey = (timestampSeconds: number): string => {
  const date = new Date(timestampSeconds * 1000);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export interface DayLabels {
  today: string;
  yesterday: string;
}

export const formatDayLabel = (
  timestampSeconds: number,
  lang: string,
  labels: DayLabels,
): string => {
  const date = new Date(timestampSeconds * 1000);
  const now = new Date();
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

  if (diffDays === 0) return labels.today;
  if (diffDays === 1) return labels.yesterday;

  const options: Intl.DateTimeFormatOptions =
    date.getFullYear() === now.getFullYear()
      ? { day: '2-digit', month: 'long' }
      : { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString(lang, options);
};

export const initials = (name: string): string => {
  const cleaned = name.replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  if (!cleaned) return '?';
  // Phone-number-only chats: use the last two digits.
  if (!/\p{L}/u.test(cleaned)) return cleaned.replace(/\s+/g, '').slice(-2);
  const parts = cleaned.split(/\s+/);
  const first = parts[0] ?? cleaned;
  const second = parts[1] ?? '';
  const firstChar = first.charAt(0);
  const secondChar = second.charAt(0);
  return (secondChar ? firstChar + secondChar : firstChar).toUpperCase();
};

/** Normalizes a phone number to international digits (no +, no spaces). */
export const normalizePhone = (input: string): string => {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) {
    return `7${digits.slice(1)}`;
  }
  return digits;
};

export const isValidPhone = (input: string): boolean => normalizePhone(input).length >= 10;
