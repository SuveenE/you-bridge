import { HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="bg-amber-200 rounded-full p-2 hover:bg-amber-300 transition-colors"
        >
          <HelpCircle size={20} className="text-gray-700" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-amber-50 text-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            How to use NoteStack
          </DialogTitle>
          <DialogDescription>
            <div className="mt-4 space-y-4 text-left">
              <div>
                <h3 className="font-bold text-gray-800">Taking Notes</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Click &quot;Notes&quot; button and you can start taking notes
                  for the day.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800">Apple Notes Sync</h3>
                <p className="text-sm text-gray-600 mt-1">
                  To sync with Apple Notes, go to note settings and add your
                  Apple Note. Always start the day&apos;s notes with
                  today&apos;s date in the format of DD/MM (e.g., 20/04). This
                  will allow you to keep your notes synchronized between
                  NoteStack and Apple Notes.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800">
                  Reading & Watch Lists
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Track your reading materials and movies/shows you want to
                  watch. Mark items as complete when finished. When adding items
                  to your notes, use &quot;Read: XXX&quot; for reading materials
                  and &quot;Watch: XXX&quot; for videos.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-800">Calendar Overview</h3>
                <p className="text-sm text-gray-600 mt-1">
                  The calendar shows your note-taking activity:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>
                      <span className="bg-[#86efac] px-2 py-0.5 rounded-sm">
                        .
                      </span>{' '}
                      - Days with notes
                    </li>
                    <li>
                      <span className="bg-[#fde68a] px-2 py-0.5 rounded-sm">
                        .
                      </span>{' '}
                      - Today
                    </li>
                    <li>
                      <span className="bg-[#fca5a5] px-2 py-0.5 rounded-sm">
                        .
                      </span>{' '}
                      - Past days without notes
                    </li>
                  </ul>
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default HelpDialog;
