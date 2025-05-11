import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export interface NavButton {
  icon: React.ReactNode;
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
  className?: string;
  id: string;
}

interface PageNavProps {
  buttons?: NavButton[];
}

export default function PageNav({ buttons = [] }: PageNavProps) {
  return (
    <div className="fixed top-3 right-3 flex gap-2 z-10 text-xs">
      <Link
        to="/"
        className="p-1 rounded flex items-center justify-center opacity-60 hover:opacity-100 hover:text-amber-600"
      >
        <Home className="h-4 w-4" />
      </Link>
      {buttons.map((button) => (
        <button
          key={button.id}
          type="button"
          onClick={button.onClick}
          className={`p-1.5 rounded-md text-black transition-colors shadow-none opacity-60 hover:opacity-100 hover:text-amber-600 ${button.className || ''}`}
          title={button.title}
          disabled={button.disabled}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
}
