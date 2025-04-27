import { JSX } from 'react';
import { format, parseISO, isToday } from 'date-fns';
import { SquareChevronLeft } from 'lucide-react';
import { NoteItem } from '../../../lib/types';

type NotesMap = {
  [date: string]: NoteItem[];
};

interface SidebarProps {
  notes: NotesMap;
  selectNote: (date: string) => void;
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
          {Object.entries(notes)
            .sort(
              ([dateA], [dateB]) =>
                new Date(dateB).getTime() - new Date(dateA).getTime(),
            )
            .map(([date, dateNotes]) => {
              const latestNote = dateNotes[dateNotes.length - 1];
              return (
                <div
                  key={date}
                  className="w-full text-left p-2 hover:bg-amber-100 rounded cursor-pointer"
                  onClick={() => {
                    selectNote(date);
                    setIsSidebarOpen(false);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      selectNote(date);
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <div className="font-normal opacity-70 flex items-center justify-between">
                    <div>{format(parseISO(date), 'EEE, MMM d, yyyy')}</div>
                    {isToday(parseISO(date)) && (
                      <div className="text-xs bg-amber-300 text-amber-900 px-2 py-0.5 rounded-lg">
                        Today
                      </div>
                    )}
                  </div>
                  <div className="text-xs opacity-50 truncate mt-1">
                    {latestNote.note.substring(0, 40)}
                    {latestNote.note.length > 40 && '...'}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
