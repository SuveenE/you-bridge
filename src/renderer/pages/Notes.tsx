import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Menu, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="flex w-screen h-screen text-black">
      <div className="fixed top-4 right-4 flex gap-2 z-10">
        <Link to="/" className="p-2 rounded flex items-center justify-center">
          <Home size={16} />
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 rounded flex items-center justify-center shadow-none"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 bg-gray-100 h-full overflow-y-auto border-r">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Previous Notes</h2>
            <div className="space-y-2">
              {notes
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .map((note) => (
                  <button
                    type="button"
                    key={note.date}
                    className="w-full text-left p-2 hover:bg-gray-200 rounded cursor-pointer"
                    onClick={() => {
                      setContent(note.content);
                      setIsSidebarOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setContent(note.content);
                        setIsSidebarOpen(false);
                      }
                    }}
                  >
                    <div className="font-medium">
                      {format(parseISO(note.date), 'MMMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {note.content.substring(0, 50)}...
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col items-center h-screen p-8 text-black flex-1">
        <div className="text-2xl font-medium w-3/5 mb-4">
          {format(today, 'MMMM d, yyyy')}
        </div>
        <textarea
          className="p-4 text-black rounded-lg w-3/5 focus:outline-none"
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your notes here..."
        />
      </div>
    </div>
  );
}
