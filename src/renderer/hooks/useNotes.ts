import { useState, useEffect } from 'react';
import { NoteType } from '../lib/types';

const NOTES_STORAGE_KEY = 'daily_notes';

type NotesMap = {
  [date: string]: {
    apple_notes?: string;
    desktop_app?: string;
  };
};

const useNotes = (date: string) => {
  const [notes, setNotes] = useState<NotesMap[string]>({});

  const saveNote = (content: string, type: NoteType) => {
    const allNotes: NotesMap = JSON.parse(
      localStorage.getItem(NOTES_STORAGE_KEY) || '{}',
    );

    // Initialize the date entry if it doesn't exist
    if (!allNotes[date]) {
      allNotes[date] = {};
    }

    // Update the specific note type
    allNotes[date][type] = content;

    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes));

    // Update state with notes for the current date
    setNotes(allNotes[date]);
  };

  useEffect(() => {
    const loadNotes = () => {
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        const allNotes: NotesMap = JSON.parse(storedNotes);
        return allNotes[date] || {};
      }
      return {};
    };

    const dateNotes = loadNotes();
    setNotes(dateNotes);
  }, [date]);

  return {
    notes,
    saveNote,
  };
};

export default useNotes;
