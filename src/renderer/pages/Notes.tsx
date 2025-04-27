import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import Navigation from '../components/notes/navigation';
import Sidebar from '../components/notes/sidebar';
import NoteEditor from '../components/notes/note-editor';

const NOTES_STORAGE_KEY = 'daily_notes';

type NotesMap = {
  [date: string]: {
    apple_notes?: string;
    desktop_app?: string;
  };
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

        // Load the target date's desktop note if it exists
        if (allNotes[targetDate]?.desktop_app) {
          setContent(allNotes[targetDate].desktop_app || '');
        } else {
          setContent('');
        }
      } else {
        // If no notes exist at all, initialize with empty object
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
      if (!updatedNotes[selectedDate]) {
        updatedNotes[selectedDate] = {};
      }
      updatedNotes[selectedDate].desktop_app = newContent;

      setNotes(updatedNotes);
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
    }
  };

  const handleDelete = () => {
    if (selectedDate === todayString) {
      const updatedNotes = { ...notes };
      if (updatedNotes[selectedDate]) {
        delete updatedNotes[selectedDate].desktop_app;
        if (!updatedNotes[selectedDate].apple_notes) {
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
    if (notes[date]?.desktop_app) {
      setContent(notes[date].desktop_app || '');
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
