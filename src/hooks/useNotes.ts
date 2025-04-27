import { useState, useEffect } from 'react';
import { NoteItem, NoteType } from '../lib/types';

const NOTES_STORAGE_KEY = 'daily_notes';

type NotesMap = {
  [date: string]: NoteItem[];
};

const useNotes = (date: string) => {
  const [notes, setNotes] = useState<NoteItem[]>([]);

  const saveNote = (content: string, type: NoteType) => {
    const allNotes: NotesMap = JSON.parse(
      localStorage.getItem(NOTES_STORAGE_KEY) || '{}',
    );

    const dateNotes = allNotes[date] || [];

    // Find the last note of the same type
    const lastNoteOfType = [...dateNotes]
      .reverse()
      .find((note) => note.type === type);

    const noteItem: NoteItem = {
      note: content,
      time: new Date().toISOString(),
      type,
    };

    if (lastNoteOfType && dateNotes[dateNotes.length - 1].type === type) {
      // Update the last note if it's the same type
      dateNotes[dateNotes.length - 1] = noteItem;
    } else {
      // Add new note to the array
      dateNotes.push(noteItem);
    }

    allNotes[date] = dateNotes;
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes));

    // Update state with all notes for the current date
    setNotes(dateNotes);
  };

  useEffect(() => {
    const loadNotes = () => {
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        const allNotes: NotesMap = JSON.parse(storedNotes);
        return allNotes[date] || [];
      }
      return [];
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
