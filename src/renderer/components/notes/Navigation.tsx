import React, { useState } from 'react';
import { Home, Settings, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotesSettings from '../home/settings';

interface NavigationProps {
  toggleSidebar: () => void;
  appleNoteName: string;
  onAppleNoteNameChange: (name: string) => void;
  isSidebarOpen: boolean;
}

function Navigation({
  toggleSidebar,
  appleNoteName,
  onAppleNoteNameChange,
  isSidebarOpen,
}: NavigationProps): React.JSX.Element {
  const [showSettings, setShowSettings] = useState(false);

  const saveSettings = () => {
    setShowSettings(false);
  };

  return (
    <>
      {/* Left-side history button - only show when sidebar is closed */}
      {!isSidebarOpen && (
        <div className="fixed top-3 left-3 z-10 text-xs">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1 m-[4px] rounded flex items-center justify-center opacity-60 hover:opacity-100 bg-transparent"
            aria-label="Toggle Sidebar"
          >
            <History size={16} />
          </button>
        </div>
      )}

      {/* Right-side navigation */}
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

        <NotesSettings
          open={showSettings}
          onOpenChange={setShowSettings}
          noteName={appleNoteName}
          onNoteNameChange={onAppleNoteNameChange}
          onSave={saveSettings}
        />
      </div>
    </>
  );
}

export default Navigation;
