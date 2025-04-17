import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  useEffect(() => {
    // Get date from URL query parameter if available
    const queryParams = new URLSearchParams(location.search);
    const dateParam = queryParams.get('date');

    const savedNotes = localStorage.getItem('notes');
    try {
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);

        // Use date from URL parameter if available, otherwise use today
        const targetDate = dateParam || todayString;
        setSelectedDate(targetDate);

        // Load the target date's note if it exists
        const targetNote = parsedNotes.find(
          (note: Note) => note.date === targetDate,
        );

        if (targetNote) {
          setContent(targetNote.content);
        } else {
          // If no note exists for the target date, set empty content
          setContent('');

          // If the target date is today, create an empty note
          if (targetDate === todayString) {
            const updatedNotes = [
              ...parsedNotes,
              { date: todayString, content: '' },
            ];
            setNotes(updatedNotes);
            localStorage.setItem('notes', JSON.stringify(updatedNotes));
          }
        }
      } else {
        // If no notes exist at all, initialize with an empty array
        setNotes([]);
        localStorage.setItem('notes', JSON.stringify([]));

        // Use date from URL parameter if available, otherwise use today
        setSelectedDate(dateParam || todayString);
      }
    } catch (error) {
      // If there's an error parsing, initialize with empty array
      setNotes([]);
      localStorage.setItem('notes', JSON.stringify([]));
      setSelectedDate(dateParam || todayString);
    }
  }, [location.search, todayString]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Only update notes if editing today's note
    if (selectedDate === todayString) {
      // Update notes array with today's note
      const updatedNotes = notes.filter((note) => note.date !== selectedDate);
      updatedNotes.push({ date: selectedDate, content: newContent });
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

  // Determine if the selected note is from a different day than today
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
        date={selectedDate}
        content={content}
        onChange={handleContentChange}
        readOnly={isReadOnly}
      />
    </div>
  );
}
