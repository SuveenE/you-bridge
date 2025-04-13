import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon-1.jpg';
import './App.css';

function Hello() {
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" className="rounded-full" src={icon} />
      </div>
      <div className="text-2xl font-medium text-center font-mono">
        By Suveen
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
