import { useState, useEffect } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { format } from 'date-fns';
import { BookOpen, FileText, Film, MessageSquare } from 'lucide-react';
import 'tldraw/tldraw.css';
import icon from '../../assets/icon.png';
import './App.css';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Reads from './pages/Reads';
import WatchList from './pages/WatchList';
import { Calendar } from './components/ui/calendar';
import HelpDialog from './components/home/help-dialog';
import WelcomeDialog from './components/home/welcome-dialog';
import { DailyNotes } from './lib/types';
import Chat from './pages/Chat';

// Key for storing start date in localStorage
const START_DATE_KEY = 'note_start_date';
const NOTES_STORAGE_KEY = 'daily_notes';

function Hello() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  const [noteDates, setNoteDates] = useState<Date[]>([]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    // Load start date from localStorage
    const savedStartDate = localStorage.getItem(START_DATE_KEY);
    if (savedStartDate) {
      try {
        const parsedStartDate = new Date(savedStartDate);
        setStartDate(parsedStartDate);
      } catch (error) {
        console.error('Error parsing start date:', error);
        // If there's an error, set today as the start date
        setStartDate(new Date());
        localStorage.setItem(START_DATE_KEY, new Date().toISOString());
      }
    } else {
      // If no start date is saved, set today as the start date
      setStartDate(new Date());
      localStorage.setItem(START_DATE_KEY, new Date().toISOString());
    }

    // Load notes from localStorage
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes) {
      try {
        const allNotes: DailyNotes = JSON.parse(savedNotes);
        // Extract dates from notes and convert to Date objects
        const dates = Object.keys(allNotes).map((dateStr) => {
          const noteDate = new Date(dateStr);
          noteDate.setHours(0, 0, 0, 0);
          return noteDate;
        });
        setNoteDates(dates);
      } catch (error) {
        console.error('Error parsing notes:', error);
      }
    }
  }, []);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if cmd (Meta) key is pressed
      if (e.metaKey) {
        switch (e.key) {
          case 'i':
            e.preventDefault();
            navigate('/notes');
            break;
          case 'l':
            e.preventDefault();
            navigate('/reads');
            break;
          case 'k':
            e.preventDefault();
            navigate('/watchlist');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      navigate(`/notes?date=${formattedDate}`);
    }
  };

  // Calculate dates without notes for red highlighting (only after start date)
  const datesWithoutNotes = startDate
    ? (Array.from(
        {
          length:
            Math.ceil(
              (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
            ) + 1,
        },
        (_, i) => {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          currentDate.setHours(0, 0, 0, 0);

          // Skip today and future dates
          if (currentDate.getTime() >= today.getTime()) {
            return null;
          }

          // Check if this date has a note
          const hasNote = noteDates.some(
            (noteDate) => noteDate.getTime() === currentDate.getTime(),
          );

          return hasNote ? null : currentDate;
        },
      ).filter(Boolean) as Date[])
    : [];

  // Create a separate array with just the dates that have notes
  const actualNoteDates = noteDates.filter((noteDate) => {
    // Make sure we're only showing notes for dates on or after the start date
    // and for dates not in the future
    if (!startDate) return false;
    return noteDate >= startDate && noteDate < today;
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 relative">
      <WelcomeDialog />
      <div className="fixed top-6 right-6 z-10">
        <HelpDialog initialTab="howto" iconType="help" />
      </div>

      <p className="text-lg font-bold my-2">NoteStack</p>

      <img width="100" alt="icon" className="mb-6" src={icon} />
      <p className="text-sm text-gray-500 mb-4">
        A simple way to track your notes, todos, and reminders.
      </p>
      <div className="flex flex-row mb-6">
        <Link
          to="/notes"
          className="px-4 py-2 bg-amber-50 text-gray-700 rounded-md hover:bg-amber-100 transition-all shadow-sm font-medium flex items-center gap-2"
        >
          <FileText size={16} strokeWidth={2} />
          <span>Notes</span>
          <span className="ml-1 text-xs bg-amber-200 px-1.5 py-0.5 rounded-md">
            ⌘ I
          </span>
        </Link>
        <Link
          to="/reads"
          className="px-4 py-2 bg-amber-50 text-gray-700 rounded-md hover:bg-amber-100 transition-all shadow-sm font-medium flex items-center gap-2"
        >
          <BookOpen size={16} strokeWidth={2} />
          <span>Reads</span>
          <span className="ml-1 text-xs bg-amber-200 px-1.5 py-0.5 rounded-md">
            ⌘ L
          </span>
        </Link>
        <Link
          to="/watchlist"
          className="px-4 py-2 bg-amber-50 text-gray-700 rounded-md hover:bg-amber-100 transition-all shadow-sm font-medium flex items-center gap-2"
        >
          <Film size={16} strokeWidth={2} />
          <span>Watch List</span>
          <span className="ml-1 text-xs bg-amber-200 px-1.5 py-0.5 rounded-md">
            ⌘ K
          </span>
        </Link>
        <Link
          to="/chat"
          className="px-4 py-2 bg-amber-50 text-gray-700 rounded-md hover:bg-amber-100 transition-all shadow-sm font-medium flex items-center gap-2"
        >
          <MessageSquare size={16} strokeWidth={2} />
          <span>Chat</span>
        </Link>
      </div>

      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-2xl border border-gray-200"
        modifiers={{
          hasNote: actualNoteDates,
          today: [today],
          withoutNote: datesWithoutNotes,
        }}
        modifiersStyles={{
          hasNote: { backgroundColor: '#86efac' }, // Brighter green for days with notes
          today: { backgroundColor: '#fde68a' }, // Brighter yellow for today
          withoutNote: { backgroundColor: '#fca5a5' }, // Brighter red for days without notes
        }}
        disabled={(dateToCheck) => {
          if (!startDate) return false;
          return dateToCheck < startDate;
        }}
        fromDate={startDate || undefined}
      />
      <div className="text-sm text-gray-500 my-8">
        <span>
          <a
            href="https://x.com/SuveenE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800"
          >
            By{' '}
            <span className="text-gray-800 hover:text-gray-800 underline">
              Suveen
            </span>
          </a>
        </span>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/reads" element={<Reads />} />
          <Route path="/watchlist" element={<WatchList />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
