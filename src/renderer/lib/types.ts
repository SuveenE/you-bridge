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
