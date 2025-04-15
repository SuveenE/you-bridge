import { useState } from 'react';

import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'tldraw/tldraw.css';
import icon from '../../assets/icon.png';
import './App.css';
import Home from './pages/Home';
import Notes from './pages/Notes';
import { Calendar } from './components/ui/calendar';

function Hello() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className="flex flex-col items-center justify-center h-screen text-black">
      <div className="Hello">
        <img width="200" alt="icon" className="rounded-full" src={icon} />
      </div>
      <div className="text-2xl font-medium text-center font-mono mb-8">
        By Suveen
      </div>
      <Link
        to="/home"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go to Drawing Board
      </Link>
      <Link
        to="/notes"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Notes
      </Link>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(value) => setDate(value)}
        className="rounded-md border bg-black"
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
