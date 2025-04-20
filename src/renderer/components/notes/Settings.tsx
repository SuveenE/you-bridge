import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteName: string;
  onNoteNameChange: (name: string) => void;
  onSave: () => void;
}

export function Settings({
  open,
  onOpenChange,
  noteName,
  onNoteNameChange,
  onSave,
}: SettingsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-amber-50">
        <DialogHeader>
          <DialogTitle className="text-xl text-black">Settings</DialogTitle>
          <DialogDescription className="text-gray-500">
            Configure your note settings
          </DialogDescription>
        </DialogHeader>

        <form className="py-4 space-y-5">
          <div className="space-y-2">
            <div id="apple-note-label" className="mb-2">
              <span className="block text-sm font-medium text-gray-700">
                Apple Note Name
              </span>
              <span className="block text-xs text-gray-500 mt-1">
                Enter the name of your Apple Note to fetch
              </span>
            </div>
            <input
              type="text"
              value={noteName}
              onChange={(e) => onNoteNameChange(e.target.value)}
              className="w-full p-2.5 bg-white text-sm border border-gray-300 rounded-md
                        shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500
                        focus:border-transparent text-gray-900"
              placeholder="e.g. Suveen Daily Notes"
              aria-labelledby="apple-note-label"
            />
          </div>
        </form>

        <p className="text-xs text-gray-500">
          When typing notes for a particular day start with a date marker. e.g.
          <span className="font-bold"> 20/04</span> and add your notes from the
          next new line onwards.
        </p>
        {/* TODO: ADD support for notes in multiple years and add previous years */}

        <DialogFooter className="sm:justify-end flex gap-2">
          <Button
            type="button"
            onClick={onSave}
            className="bg-lime-200 hover:bg-lime-300 text-black font-medium"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Settings;
