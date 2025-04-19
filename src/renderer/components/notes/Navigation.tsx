import React, { useState } from 'react';
import { Home, Settings, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotesSettings from './Settings';

interface NavigationProps {
  toggleSidebar: () => void;
  appleNoteName?: string;
  onAppleNoteNameChange?: (name: string) => void;
  todayOnly?: boolean;
  onTodayOnlyChange?: (value: boolean) => void;
}

function Navigation({
  toggleSidebar,
  appleNoteName = '',
  onAppleNoteNameChange = () => {},
  todayOnly = true,
  onTodayOnlyChange = () => {},
}: NavigationProps): React.JSX.Element {
  const [showSettings, setShowSettings] = useState(false);

  const saveSettings = () => {
    setShowSettings(false);
  };

  return (
    <div className="fixed top-3 right-3 flex gap-2 z-10 text-xs">
      <Link
        to="/"
        className="p-1 rounded flex items-center justify-center opacity-60 hover:opacity-100"
      >
        <Home size={16} />
      </Link>
      <button
        type="button"
        onClick={() => setShowSettings(true)}
        className="p-1 m-[4px] rounded flex items-center justify-center opacity-60 hover:opacity-100 bg-transparent"
        aria-label="Apple Notes Settings"
      >
        <Settings size={16} />
      </button>
      <button
        type="button"
        onClick={toggleSidebar}
          className="p-1 m-[4px] rounded flex items-center justify-center opacity-60 hover:opacity-100 cursor-pointer bg-transparent"
        aria-label="Toggle Sidebar"
      >
        <History size={16} />
      </button>

      <NotesSettings
        open={showSettings}
        onOpenChange={setShowSettings}
        noteName={appleNoteName}
        onNoteNameChange={onAppleNoteNameChange}
        todayOnly={todayOnly}
        onTodayOnlyChange={onTodayOnlyChange}
        onSave={saveSettings}
      />
    </div>
  );
}

export default Navigation;
