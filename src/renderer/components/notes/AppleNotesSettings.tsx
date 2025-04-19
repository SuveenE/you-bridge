import React from 'react';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface AppleNotesSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteName: string;
  onNoteNameChange: (name: string) => void;
  todayOnly: boolean;
  onTodayOnlyChange: (value: boolean) => void;
  onSave: () => void;
}

export function AppleNotesSettings({
  open,
  onOpenChange,
  noteName,
  onNoteNameChange,
  todayOnly,
  onTodayOnlyChange,
  onSave,
}: AppleNotesSettingsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-amber-50">
        <DialogHeader>
          <DialogTitle className="text-xl text-black">Apple Notes Settings</DialogTitle>
          <DialogDescription className="text-gray-500">
            Configure how notes are fetched from Apple Notes
          </DialogDescription>
        </DialogHeader>

        <form className="py-4 space-y-5">
          <div>
            <div className="mb-2">
              <label
                htmlFor="apple-note-name"
                className="text-sm font-medium text-gray-700"
              >
                Apple Note Name
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Enter the name of your Apple Note to fetch
              </p>
            </div>
            <input
              id="apple-note-name"
              type="text"
              value={noteName}
              onChange={(e) => onNoteNameChange(e.target.value)}
              className="w-full p-2.5 bg-white text-sm border border-gray-300 rounded-md
                        shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500
                        focus:border-transparent text-gray-900"
              placeholder="e.g. Suveen Daily Notes"
            />
          </div>

          <fieldset>
            <div className="flex items-center">
              <input
                id="today-only"
                type="checkbox"
                checked={todayOnly}
                onChange={(e) => onTodayOnlyChange(e.target.checked)}
                className="h-4 w-4 text-amber-600 border-gray-300 rounded
                          focus:ring-amber-500"
              />
              <div className="ml-3 text-sm">
                <label
                  htmlFor="today-only"
                  className="font-medium text-gray-700"
                >
                  Only fetch today&apos;s entries
                </label>
                <p className="text-gray-500">
                  Extract only content from today&apos;s date
                </p>
              </div>
            </div>
          </fieldset>
        </form>

        <DialogFooter className="sm:justify-between flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSave}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Check className="mr-2 h-4 w-4" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AppleNotesSettings;
