import { useState, useEffect } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from 'react-router-dom';
import { format } from 'date-fns';
import 'tldraw/tldraw.css';
import icon from '../../assets/icon.png';
import './App.css';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Reads from './pages/Reads';
import { Calendar } from './components/ui/calendar';

function Hello() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  const [noteDates, setNoteDates] = useState<Date[]>([]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Extract dates from notes and convert to Date objects
        const dates = parsedNotes.map((note: { date: string }) => {
          const noteDate = new Date(note.date);
          noteDate.setHours(0, 0, 0, 0);
          return noteDate;
        });
        setNoteDates(dates);
      } catch (error) {
        console.error('Error parsing notes:', error);
      }
    }
  }, []);

  const handleDateSelect = (value: Date | undefined) => {
    setDate(value);
    if (value) {
      const formattedDate = format(value, 'yyyy-MM-dd');
      navigate(`/notes?date=${formattedDate}`);
    }
  };

  // Calculate past dates without notes for red highlighting
  const pastDatesWithoutNotes = Array.from(
    { length: today.getDate() - 1 },
    (_, i) => {
      const currentDate = new Date(today);
      currentDate.setDate(i + 1);
      currentDate.setHours(0, 0, 0, 0);

      // Check if this date has a note
      const hasNote = noteDates.some(
        (noteDate) => noteDate.getTime() === currentDate.getTime(),
      );

      return hasNote ? null : currentDate;
    },
  ).filter(Boolean) as Date[];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800">
      <p className="text-lg font-bold mb-2">Stack</p>
      <p className="text-sm text-gray-500 mb-4">
        A simple way to track your notes, todos, and reminders.
      </p>
      <img width="100" alt="icon" className="rounded-full mb-6" src={icon} />

      <div className="flex space-x-4 mb-6 text-md">
        <Link
          to="/notes"
          className="px-4 py-2 bg-amber-100 text-gray-700 rounded-md hover:bg-amber-200 transition-all shadow-sm font-medium"
        >
          Notes
        </Link>
        <Link
          to="/reads"
          className="px-4 py-2 bg-amber-200 text-gray-700 rounded-md hover:bg-amber-300 transition-all shadow-sm font-medium"
        >
          Reading List
        </Link>
      </div>

      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-2xl border border-gray-200"
        modifiers={{
          hasNote: noteDates,
          today: [today],
          pastWithoutNote: pastDatesWithoutNotes,
        }}
        modifiersStyles={{
          hasNote: { backgroundColor: '#86efac' }, // Brighter green for days with notes
          today: { backgroundColor: '#fde68a' }, // Brighter yellow for today
          pastWithoutNote: { backgroundColor: '#fca5a5' }, // Brighter red for past days without notes
        }}
      />
      <div className="text-sm text-gray-500 my-8">By Suveen</div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/home" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/reads" element={<Reads />} />
      </Routes>
    </Router>
  );
}
