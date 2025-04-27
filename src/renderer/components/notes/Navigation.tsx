import React from 'react';
import { Home, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import HelpDialog from '../home/help-dialog';

interface NavigationProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

function Navigation({
  toggleSidebar,
  isSidebarOpen,
}: NavigationProps): React.JSX.Element {
  return (
    <>
      {/* Left-side history button - only show when sidebar is closed */}
      {!isSidebarOpen && (
        <div className="fixed top-3 left-3 z-10 gap-2 text-xs">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1.5 rounded-md flex items-center justify-center text-gray-800 hover:text-amber-600 m-[10px] bg-transparent shadow-none"
            aria-label="Toggle Sidebar"
            title="Look at past notes"
          >
            <History size={18} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Right-side navigation */}
      <div className="fixed top-3 right-3 flex gap-2 z-10 text-xs">
        <Link
          to="/"
          className="p-1.5 rounded-md flex items-center justify-center text-gray-800 hover:text-amber-600"
        >
          <Home size={18} strokeWidth={2} />
        </Link>
        <HelpDialog initialTab="settings" iconType="settings" />
      </div>
    </>
  );
}

export default Navigation;
