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
        <HelpDialog initialTab="settings" iconType="settings" />
      </div>
    </>
  );
}

export default Navigation;
