import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../../../assets/hands.png';
import '../App.css';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Navbar from '../components/shared/Navbar';

export default function Home() {
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
      <Navbar />
      <p className="text-lg font-bold my-2">You bridge</p>

      <img width="100" alt="icon" className="mb-6 rounded-2xl" src={image} />
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Files</Label>
        <Input id="picture" type="file" />
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
              Suv Jy and XZ
            </span>
          </a>
        </span>
      </div>
    </div>
  );
}
