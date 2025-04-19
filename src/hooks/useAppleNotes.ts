import { useState, useEffect } from 'react';

interface AppleNoteData {
  content: string | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseAppleNotesOptions {
  todayOnly?: boolean;
}

export function useAppleNotes(
  noteName: string,
  options: UseAppleNotesOptions = {},
): AppleNoteData {
  const { todayOnly = false } = options;
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchNote() {
      if (!noteName) return;

      setIsLoading(true);
      setError(null);

      try {
        // Access the exposed electron API
        const noteContent = todayOnly
          ? await window.electron.appleNotes.fetchTodaysNote(noteName)
          : await window.electron.appleNotes.fetchNote(noteName);

        setContent(noteContent);
      } catch (err) {
        console.error('Error fetching Apple Note:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to fetch note'),
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchNote();
  }, [noteName, todayOnly]);

  return { content, isLoading, error };
}

export default useAppleNotes;
