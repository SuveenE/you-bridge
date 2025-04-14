import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'tldraw/tldraw.css';
import icon from '../../assets/icon.png';
import './App.css';
import Home from './components/Home';

function Hello() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
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
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}
