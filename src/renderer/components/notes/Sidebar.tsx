import { JSX } from 'react';
import { format, parseISO, isToday } from 'date-fns';
import { SquareChevronLeft } from 'lucide-react';

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
    <div className="w-52 bg-amber-50 h-full overflow-y-auto border-r text-xs">
      <div className="py-6 px-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold ml-2 text-gray-800">
            Previous Stacks
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded flex items-center justify-center text-gray-800 hover:text-amber-600"
            aria-label="Close Sidebar"
          >
            <SquareChevronLeft size={18} strokeWidth={2} />
          </button>
        </div>
        <div className="space-y-1">
          {notes
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((note) => (
              <div
                key={note.date}
                className="w-full text-left p-2 hover:bg-amber-100 rounded cursor-pointer"
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
                    <div className="text-xs bg-amber-300 text-amber-900 px-2 py-0.5 rounded-lg">
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
