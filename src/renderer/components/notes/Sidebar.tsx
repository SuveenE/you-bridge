import React, { JSX } from 'react';
import { format, parseISO } from 'date-fns';

interface Note {
  date: string;
  content: string;
}

interface SidebarProps {
  notes: Note[];
  selectNote: (date: string, content: string) => void;
  setIsSidebarOpen: (open: boolean) => void;
}

function Sidebar({
  notes,
  selectNote,
  setIsSidebarOpen,
}: SidebarProps): JSX.Element {
  return (
    <div className="w-52 bg-gray-50 h-full overflow-y-auto border-r text-xs">
      <div className="p-3">
        <div className="text-sm font-normal mb-3 opacity-70">Notes</div>
        <div className="space-y-1">
          {notes
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((note) => (
              <div
                key={note.date}
                className="w-full text-left p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => {
                  selectNote(note.date, note.content);
                  setIsSidebarOpen(false);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    selectNote(note.date, note.content);
                    setIsSidebarOpen(false);
                  }
                }}
              >
                <div className="font-normal opacity-70">
                  {format(parseISO(note.date), 'MMM d, yyyy')}
                </div>
                <div className="text-xs opacity-50 truncate mt-1">
                  {note.content.substring(0, 40)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
