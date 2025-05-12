import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import icon from '../../../assets/icon.png';
import '../App.css';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import storeFile from '@/src/main/services/files';

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    window.electron.ipcRenderer
      .storeFile(file)
      .then((result) => {
        console.log('processing result:', result);
        return result;
      })
      .catch((err) => {
        console.error('processing failed:', err);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 relative">
      <p className="text-lg font-bold my-2">You bridge</p>

      <img width="100" alt="icon" className="mb-6" src={icon} />
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Files</Label>
        <Input id="picture" type="file" onChange={handleFileChange} />
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
