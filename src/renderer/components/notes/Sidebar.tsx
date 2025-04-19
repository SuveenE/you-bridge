import React, { JSX } from 'react';
import { format, parseISO, isToday } from 'date-fns';

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
        <div className="text-sm font-normal mb-3 ml-2 opacity-70">
          Previous Stacks
        </div>
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
                <div className="font-normal opacity-70 flex items-center justify-between">
                  <div>{format(parseISO(note.date), 'EEE, MMM d, yyyy')}</div>
                  {isToday(parseISO(note.date)) && (
                    <div className="text-xs bg-lime-200 text-lime-800 px-2 py-0.5 rounded-lg">
                      Today
                    </div>
                  )}
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
