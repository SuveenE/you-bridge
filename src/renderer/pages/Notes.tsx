import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import Navigation from '../components/notes/navigation';
import Sidebar from '../components/notes/sidebar';
import NoteEditor from '../components/notes/note-editor';
import { NoteItem } from '../../lib/types';

const NOTES_STORAGE_KEY = 'daily_notes';

type NotesMap = {
  [date: string]: NoteItem[];
};

export default function Notes() {
  const [content, setContent] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notes, setNotes] = useState<NotesMap>({});
  const [selectedDate, setSelectedDate] = useState('');

  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  const location = useLocation();

  useEffect(() => {
    // Get date from URL query parameter if available
    const queryParams = new URLSearchParams(location.search);
    const dateParam = queryParams.get('date');

    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    try {
      if (savedNotes) {
        const allNotes: NotesMap = JSON.parse(savedNotes);
        setNotes(allNotes);

        // Use date from URL parameter if available, otherwise use today
        const targetDate = dateParam || todayString;
        setSelectedDate(targetDate);

        // Load the target date's note if it exists
        if (allNotes[targetDate]?.length > 0) {
          setContent(
            allNotes[targetDate][allNotes[targetDate].length - 1].note,
          );
        } else {
          setContent('');
        }
      } else {
        // If no notes exist at all, initialize with an empty object
        setNotes({});
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify({}));
        setSelectedDate(dateParam || todayString);
      }
    } catch (error) {
      // If there's an error parsing, initialize with empty object
      setNotes({});
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify({}));
      setSelectedDate(dateParam || todayString);
    }
  }, [location.search, todayString]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Only update notes if editing today's note
    if (selectedDate === todayString) {
      const updatedNotes = { ...notes };
      const noteItem: NoteItem = {
        note: newContent,
        time: new Date().toISOString(),
        type: 'desktop_app',
      };

      if (!updatedNotes[selectedDate]) {
        updatedNotes[selectedDate] = [];
      }

      if (
        updatedNotes[selectedDate].length > 0 &&
        updatedNotes[selectedDate][updatedNotes[selectedDate].length - 1]
          .type === 'desktop_app'
      ) {
        // Update the last note if it's from desktop_app
        updatedNotes[selectedDate][updatedNotes[selectedDate].length - 1] = noteItem;
      } else {
        // Add a new note
        updatedNotes[selectedDate].push(noteItem);
      }

      setNotes(updatedNotes);
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
    }
  };

  const handleDelete = () => {
    if (selectedDate === todayString) {
      const updatedNotes = { ...notes };
      if (updatedNotes[selectedDate]) {
        updatedNotes[selectedDate] = updatedNotes[selectedDate].filter(
          (note) => note.type !== 'desktop_app',
        );
        if (updatedNotes[selectedDate].length === 0) {
          delete updatedNotes[selectedDate];
        }
        setNotes(updatedNotes);
        setContent('');
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
      }
    }
  };

  const selectNote = (date: string) => {
    setSelectedDate(date);
    if (notes[date]?.length > 0) {
      setContent(notes[date][notes[date].length - 1].note);
    } else {
      setContent('');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Determine if the selected note is from a different day than today
  const isReadOnly = selectedDate !== todayString;

  return (
    <div className="flex w-screen h-screen text-gray-800 bg-white">
      <Navigation toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      {isSidebarOpen && (
        <Sidebar
          notes={notes}
          selectNote={selectNote}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      <NoteEditor
        date={selectedDate}
        content={content}
        onChange={handleContentChange}
        readOnly={isReadOnly}
        onDelete={handleDelete}
      />
    </div>
  );
}
