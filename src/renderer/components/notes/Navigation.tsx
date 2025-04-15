import React, { JSX } from 'react';
import { Menu, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  toggleSidebar: () => void;
}

function Navigation({ toggleSidebar }: NavigationProps): JSX.Element {
  return (
    <div className="fixed top-3 right-3 flex gap-2 z-10 text-xs">
      <Link
        to="/"
        className="p-1 rounded flex items-center justify-center opacity-60 hover:opacity-100"
      >
        <Home size={14} />
      </Link>
      <div
        onClick={toggleSidebar}
        className="p-1 rounded flex items-center justify-center opacity-60 hover:opacity-100 cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleSidebar();
          }
        }}
      >
        <Menu size={14} />
      </div>
    </div>
  );
}

export default Navigation;
