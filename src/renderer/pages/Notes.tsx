import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Navigation from '../components/notes/Navigation';
import Sidebar from '../components/notes/Sidebar';
import NoteEditor from '../components/notes/NoteEditor';

interface Note {
  date: string;
  content: string;
}

export default function Notes() {
  const [content, setContent] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    try {
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        // Load today's note if it exists
        const todayNote = parsedNotes.find(
          (note: Note) => note.date === todayString,
        );
        if (todayNote) {
          setContent(todayNote.content);
        }
        // Initialize selectedDate to today
        setSelectedDate(todayString);
      }
    } catch (error) {
      // If there's an error parsing, initialize with empty array
      setNotes([]);
      localStorage.setItem('notes', JSON.stringify([]));
      setSelectedDate(todayString);
    }
  }, [todayString]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Only update notes if editing today's note
    if (selectedDate === todayString) {
      // Update notes array with today's note
      const updatedNotes = notes.filter((note) => note.date !== todayString);
      updatedNotes.push({ date: todayString, content: newContent });
      setNotes(updatedNotes);

      // Save to localStorage
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }
  };

  const selectNote = (date: string, noteContent: string) => {
    setSelectedDate(date);
    setContent(noteContent);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Determine if the selected note is from a previous day
  const isReadOnly = selectedDate !== todayString;

  return (
    <div className="flex w-screen h-screen text-black bg-white">
      <Navigation toggleSidebar={toggleSidebar} />
      {isSidebarOpen && (
        <Sidebar
          notes={notes}
          selectNote={selectNote}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      <NoteEditor
        date={selectedDate ? todayString : ''}
        content={content}
        onChange={handleContentChange}
        readOnly={isReadOnly}
      />
    </div>
  );
}
