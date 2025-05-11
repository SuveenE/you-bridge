import { useEffect } from 'react';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BookOpen, FileText, Film, MessageSquare } from 'lucide-react';
import 'tldraw/tldraw.css';
import icon from '../../assets/icon.png';
import './App.css';

function Hello() {
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  // Create a separate array with just the dates that have notes

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 relative">
      <p className="text-lg font-bold my-2">You bridge</p>

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
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
