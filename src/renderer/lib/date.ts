export function getTodayFormatted() {
  const today = new Date();
  return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}`;
}

export const formatDateKey = (date: Date): string => {
  return `${String(date.getDate()).padStart(2, '0')}/${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}/${date.getFullYear()}`;
};

export const getCurrentDateKey = (): string => {
  return formatDateKey(new Date());
};
