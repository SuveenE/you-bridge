import { useState, useEffect } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import { format } from 'date-fns';
import 'tldraw/tldraw.css';
import icon from '../../assets/icon.png';
import './App.css';
import Home from './pages/Home';
import Notes from './pages/Notes';
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
      <img width="100" alt="icon" className="rounded-full mb-6" src={icon} />
      <div className="text-sm text-gray-500 mb-8">By Suveen</div>
      <Link
        to="/notes"
        className="px-3 py-1.5 mb-6 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition"
      >
        Notes
      </Link>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-sm border border-gray-200"
        modifiers={{
          hasNote: noteDates,
          today: [today],
          pastWithoutNote: pastDatesWithoutNotes,
        }}
        modifiersStyles={{
          hasNote: { backgroundColor: '#d1fae5' }, // Green background for days with notes
          today: { backgroundColor: '#fef3c7' }, // Yellow background for today
          pastWithoutNote: { backgroundColor: '#fee2e2' }, // Red background for past days without notes
        }}
      />
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
      </Routes>
    </Router>
  );
}
