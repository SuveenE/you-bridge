import React, { JSX, useEffect, useRef, useState, useCallback } from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import {
  format,
  parseISO,
  isToday,
  endOfDay,
  differenceInMilliseconds,
} from 'date-fns';
import { useAppleNotes } from '../../../hooks/useAppleNotes';

interface NoteEditorProps {
  date: string;
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly: boolean;
}

function NoteEditor({
  date,
  content,
  onChange,
  readOnly = false,
}: NoteEditorProps): JSX.Element {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [autoSyncScheduled, setAutoSyncScheduled] = useState(false);

  // Check if the currently viewed note is from today
  const isTodayNote = date ? isToday(parseISO(date)) : false;

  // Get Apple Notes settings from localStorage
  const [settings, setSettings] = useState({
    noteName: 'Your Note Name',
    todayOnly: true,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('appleNotesSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error loading Apple Notes settings:', error);
      }
    }
  }, []);

  const {
    content: appleNoteContent,
    isLoading,
    error,
    refetch,
  } = useAppleNotes(isTodayNote ? settings.noteName : '', {
    todayOnly: false, // Always fetch entire note regardless of setting
  });

  console.log('appleNoteContent', appleNoteContent);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 10}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  // Helper function to parse the Apple Notes content to extract only today's content
  const parseNoteContent = (noteText: string) => {
    // Get today's date in the format used in notes (DD/MM)
    const today = new Date();
    const todayFormatted = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}`;

    // Split the content by lines
    const lines = noteText.split('\n');
    let currentDate = '';
    const todaysContentLines: string[] = [];
    let captureContent = false;

    lines.forEach((line) => {
      // Check if the line is a date marker (like "20/04")
      const dateMatch = line.match(/^\d{2}\/\d{2}$/);

      if (dateMatch) {
        currentDate = line;
        // Start capturing content if this is today's date
        captureContent = currentDate === todayFormatted;
        return;
      }

      // If we're in the section for today's date, capture the content
      if (captureContent && line.trim() !== '') {
        todaysContentLines.push(line);
      }
    });

    return todaysContentLines.join('\n');
  };

  // Function to combine Apple Notes content with textarea content
  const combineNotesContent = useCallback(() => {
    if (appleNoteContent && !readOnly && isTodayNote) {
      const todayContent = parseNoteContent(appleNoteContent);

      // Combine the parsed content with existing content
      const updatedContent = content
        ? `${content}\n\n---\nApple Notes content:\n${todayContent}`
        : todayContent;

      const event = {
        target: { value: updatedContent },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(event);
    }
  }, [appleNoteContent, readOnly, isTodayNote, content, onChange]);

  // Handle manual refresh when refresh icon is clicked
  const handleManualRefresh = async () => {
    await refetch();
  };

  // Schedule end-of-day combination of Apple Notes with textarea content
  useEffect(() => {
    if (isTodayNote && !readOnly && !autoSyncScheduled) {
      const today = new Date();
      const endDay = endOfDay(today);
      const timeUntilEndOfDay = differenceInMilliseconds(endDay, today);

      // Set a timeout to combine notes at the end of the day
      const timer = setTimeout(() => {
        combineNotesContent();
      }, timeUntilEndOfDay);

      setAutoSyncScheduled(true);

      // Clean up the timer when component unmounts
      return () => {
        clearTimeout(timer);
      };
    }
    // Return a no-op cleanup function when the condition isn't met
    return () => {};
  }, [isTodayNote, readOnly, autoSyncScheduled, combineNotesContent]);

  // Format the date to include day of week
  const formattedDate = date ? format(parseISO(date), 'EEEE, MMM d, yyyy') : '';

  // Render note content based on state
  const renderNoteContent = () => {
    if (isLoading) {
      return <p className="text-gray-500">Loading notes...</p>;
    }

    if (error) {
      return <p className="text-red-500">Error: {error.message}</p>;
    }

    if (!appleNoteContent) {
      return (
        <p className="text-amber-800">
          No content found. Please check your Apple Notes settings and make sure
          the note exists.
        </p>
      );
    }

    // Get today's content for the preview
    const todayContentPreview = appleNoteContent
      ? parseNoteContent(appleNoteContent)
      : '';
    const previewContent = todayContentPreview || appleNoteContent;

    // Display the Apple Note content with proper whitespace handling
    return (
      <div>
        <p className="text-xs text-gray-500 mb-2">
          Apple Note preview (will be combined with your notes at end of day):
        </p>
        <div className="apple-note-content whitespace-pre-line text-sm font-sans overflow-auto">
          {previewContent}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center h-screen p-6 text-black flex-1">
      <div className="flex flex-row justify-between text-sm font-normal w-3/5 mb-3">
        <div className="flex items-center opacity-60">
          <p>{formattedDate}</p>
          {readOnly && (
            <span className="ml-2 text-amber-600">
              <Lock className="h-4 w-4" />
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          {isTodayNote && !readOnly && (
            <button
              type="button"
              onClick={handleManualRefresh}
              className="p-1.5 rounded-md bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
              title="Manually sync with Apple Notes"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
          )}
        </div>
      </div>

      {appleNoteContent && isTodayNote && !readOnly && (
        <div className="w-3/5 mb-4 p-3 text-sm border rounded-lg bg-amber-50 max-h-60 overflow-auto">
          {renderNoteContent()}
        </div>
      )}

      <textarea
        ref={textareaRef}
        className={`p-3 text-black rounded-lg w-3/5 focus:outline-none text-sm resize-none ${
          readOnly ? 'bg-amber-50' : ''
        }`}
        value={content}
        onChange={(e) => {
          onChange(e);
          adjustHeight();
        }}
        placeholder="Start typing your notes here..."
        readOnly={readOnly}
        rows={1}
      />
    </div>
  );
}

export default NoteEditor;
