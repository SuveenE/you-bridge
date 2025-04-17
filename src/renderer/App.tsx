import { useState } from 'react';
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

  const handleDateSelect = (value: Date | undefined) => {
    setDate(value);
    if (value) {
      const formattedDate = format(value, 'yyyy-MM-dd');
      navigate(`/notes?date=${formattedDate}`);
    }
  };

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
