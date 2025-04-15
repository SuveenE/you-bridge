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
      }
    } catch (error) {
      // If there's an error parsing, initialize with empty array
      setNotes([]);
      localStorage.setItem('notes', JSON.stringify([]));
    }
  }, [todayString]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Update notes array with today's note
    const updatedNotes = notes.filter((note) => note.date !== todayString);
    updatedNotes.push({ date: todayString, content: newContent });
    setNotes(updatedNotes);

    // Save to localStorage
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex w-screen h-screen text-black bg-white">
      <Navigation toggleSidebar={toggleSidebar} />
      {isSidebarOpen && (
        <Sidebar
          notes={notes}
          setContent={setContent}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      <NoteEditor
        date={today}
        content={content}
        onChange={handleContentChange}
      />
    </div>
  );
}
