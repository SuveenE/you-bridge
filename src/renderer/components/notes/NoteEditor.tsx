import React, { JSX, useEffect, useRef, useState } from 'react';
import { Lock, RefreshCw, Trash2 } from 'lucide-react';
import { format, parseISO, isToday } from 'date-fns';
import { useAppleNotes } from '../../hooks/useAppleNotes';
import useNotes from '../../hooks/useNotes';
import { NoteType } from '../../lib/types';
import DeleteNoteDialog from './DeleteNoteDialog';

// Helper function to get today's date in DD/MM format
const getTodayFormatted = () => {
  const today = new Date();
  return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}`;
};

interface NoteEditorProps {
  date: string;
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly: boolean;
  onDelete: () => void;
}

function NoteEditor({
  date,
  content,
  onChange,
  readOnly = false,
  onDelete,
}: NoteEditorProps): JSX.Element {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { saveNote } = useNotes(date);

  // Check if the currently viewed note is from today
  const isTodayNote = date ? isToday(parseISO(date)) : false;

  // Get Apple Notes settings from localStorage
  const [settings, setSettings] = useState({
    noteName: 'Daily Notes',
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

  // Helper function to parse the Apple Notes content to extract only today's content
  const parseNoteContent = (noteText: string) => {
    // Get today's date in the format used in notes (DD/MM)
    const todayFormatted = getTodayFormatted();

    // Split the content by sections based on dates
    const sections = noteText.split(/(?=^\d{2}\/\d{2}$)/m);

    // Find today's section
    const todaySection = sections.find((section) =>
      section.trim().startsWith(todayFormatted),
    );

    if (!todaySection) {
      return '';
    }

    // Remove the date line and return the content
    return todaySection
      .split('\n')
      .slice(1) // Skip the date line
      .filter((line) => line.trim() !== '')
      .join('\n');
  };

  // Handle manual refresh when refresh icon is clicked
  const handleManualRefresh = async () => {
    await refetch();
  };

  // Format the date to include day of week
  const formattedDate = date ? format(parseISO(date), 'EEEE, MMM d, yyyy') : '';

  // Render note content based on state
  const renderNoteContent = () => {
    if (isLoading) {
      return <p className="text-gray-600">Loading notes...</p>;
    }

    if (error) {
      return <p className="text-red-600">Error: {error.message}</p>;
    }

    if (!appleNoteContent) {
      return (
        <p className="text-gray-700">
          No content found. Please check your Apple Notes settings and make sure
          the note exists.
        </p>
      );
    }

    // Get today's content for the preview
    const todayContentPreview = appleNoteContent
      ? parseNoteContent(appleNoteContent)
      : '';

    if (!todayContentPreview) {
      return (
        <p className="text-gray-700 text-xs">
          No new content available from Apple Notes.
        </p>
      );
    }

    // Display the Apple Note content with proper whitespace handling
    return (
      <div>
        <div className="apple-note-content whitespace-pre-line text-sm text-gray-800 overflow-auto">
          {todayContentPreview}
        </div>
      </div>
    );
  };

  // Effect to handle saving Apple Notes content
  useEffect(() => {
    if (appleNoteContent) {
      const todayContentPreview = parseNoteContent(appleNoteContent);
      saveNote(todayContentPreview, 'apple_notes' as NoteType);
    }
  }, [appleNoteContent]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center h-screen p-6 text-gray-800 flex-1 bg-white pt-16">
      <DeleteNoteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete();
          setIsDeleteDialogOpen(false);
        }}
        date={formattedDate}
      />
      <div className="flex flex-row justify-between text-sm w-3/5 mb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <p className="font-bold text-gray-800">{formattedDate}</p>
            {readOnly && (
              <span className="text-gray-600">
                <Lock size={18} strokeWidth={2} />
              </span>
            )}
          </div>
          {readOnly && (
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="ml-2 hover:text-red-600 transition-colors shadow-none"
              title="Delete note"
            >
              <Trash2 size={18} strokeWidth={2} />
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          {isTodayNote && !readOnly && (
            <button
              type="button"
              onClick={handleManualRefresh}
              className="p-1.5 rounded-md bg-amber-200 text-gray-900 hover:bg-amber-300 transition-colors font-medium"
              title="Manually sync with Apple Notes"
            >
              <RefreshCw
                className={`${isLoading ? 'animate-spin' : ''}`}
                size={18}
                strokeWidth={2}
              />
            </button>
          )}
        </div>
      </div>

      {appleNoteContent && isTodayNote && !readOnly && (
        <div className="w-3/5 mb-4 p-4 text-sm border border-amber-200 rounded-md bg-white shadow-sm max-h-60 overflow-auto relative">
          <div className="absolute top-2 right-2"></div>
          {renderNoteContent()}
        </div>
      )}

      <textarea
        ref={textareaRef}
        className={`p-4 text-gray-900 rounded-md w-3/5 focus:outline-none focus:border-transparent text-sm resize-none ${
          readOnly ? 'bg-amber-50 border-amber-200' : ''
        }`}
        value={
          readOnly && appleNoteContent
            ? `${parseNoteContent(appleNoteContent)}\n\n${content}`
            : content
        }
        onChange={(e) => {
          onChange(e);
          if (!readOnly) {
            saveNote(e.target.value, 'desktop_app' as NoteType);
          }
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
