import React, { JSX, useEffect, useRef, useState } from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import { format, parseISO, isToday } from 'date-fns';
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
  const [syncAttempted, setSyncAttempted] = useState(false);

  // Check if the currently viewed note is from today
  const isTodayNote = date ? isToday(parseISO(date)) : false;

  // Get Apple Notes settings from localStorage
  const [settings, setSettings] = useState({
    noteName: 'Suveen Daily Notes',
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

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 10}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  // Handle importing Apple Notes content into the editor
  const importFromAppleNotes = () => {
    setSyncAttempted(true);

    // Force a refetch of Apple Notes content
    if (refetch) {
      refetch();
    }

    if (appleNoteContent && !readOnly && isTodayNote) {
      // Append the Apple Notes content to existing content
      const updatedContent = content
        ? `${content}\n\n${appleNoteContent}`
        : appleNoteContent;

      const event = {
        target: { value: updatedContent },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(event);
    }
  };

  // Format the date to include day of week
  const formattedDate = date ? format(parseISO(date), 'EEEE, MMM d, yyyy') : '';

  // Button class based on state
  const getSyncButtonClass = (): string => {
    if (isLoading) {
      return 'bg-gray-100 text-gray-400';
    }

    if (appleNoteContent) {
      return 'bg-lime-200 text-gray-800 hover:bg-lime-300';
    }

    if (syncAttempted && !appleNoteContent) {
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    }

    return 'bg-lime-200 text-gray-800 hover:bg-lime-300';
  };

  // Render note content based on state
  const renderNoteContent = () => {
    if (isLoading) {
      return <p className="text-gray-500">Loading notes...</p>;
    }

    if (error) {
      return <p className="text-red-500">Error: {error.message}</p>;
    }

    if (syncAttempted && !appleNoteContent) {
      return (
        <p className="text-amber-800">
          No content found. Please check your Apple Notes settings and make sure
          the note exists.
        </p>
      );
    }

    // Display the Apple Note content with proper whitespace handling
    return (
      <div>
        <p className="text-xs text-gray-500 mb-2">
          Apple Note preview (click sync button to import):
        </p>
        <div className="apple-note-content whitespace-pre-line text-sm font-sans overflow-auto">
          {appleNoteContent}
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
              onClick={importFromAppleNotes}
              disabled={isLoading}
              className={`p-1.5 rounded-md ${getSyncButtonClass()}`}
              title="Sync with Apple Notes"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </button>
          )}
        </div>
      </div>

      {(syncAttempted || appleNoteContent) && isTodayNote && !readOnly && (
        <div className="w-3/5 mb-4 p-3 text-sm border rounded-lg bg-amber-50 max-h-60 overflow-auto">
          {renderNoteContent()}
        </div>
      )}

      <textarea
        ref={textareaRef}
        className={`p-3 text-black rounded-lg w-3/5 focus:outline-none text-sm resize-none ${
          readOnly ? 'bg-gray-100' : ''
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
