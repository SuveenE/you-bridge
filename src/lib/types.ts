export type NoteType = 'desktop_app' | 'apple_notes';

export interface NoteItem {
  note: string;
  time: string;
  type: NoteType;
}

export interface DailyNotes {
  [key: string]: {
    [key: number]: NoteItem;
  };
}

export const formatDateKey = (date: Date): string => {
  return `${String(date.getDate()).padStart(2, '0')}/${String(
    date.getMonth() + 1
  ).padStart(2, '0')}/${date.getFullYear()}`;
};

export const getCurrentDateKey = (): string => {
  return formatDateKey(new Date());
};
