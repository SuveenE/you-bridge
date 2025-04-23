import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export default function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('has_seen_welcome');

    // Show dialog only for new users (no notes and hasn't seen welcome)
    if (!hasSeenWelcome) {
      // Remove the ! to test the dialog
      setIsOpen(true);
      // Mark that the user has seen the welcome dialog
      localStorage.setItem('has_seen_welcome', 'true');
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-amber-50 text-gray-800">
        <DialogHeader>
          <DialogTitle>Welcome to NoteStack! 👋</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <p>
            Press <kbd className="px-1.5 py-0.5 bg-amber-200 rounded">⌘ I</kbd>
            and start taking notes for the current day.
          </p>
          <p className="font-semibold">Taking Notes</p>
          <p>
            When taking notes, add to your reads and the watchlist using the
            format below.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Reads ⇒ Read: [Title/URL]</li>
            <li>Watchlist ⇒ Watch: [Title/URL]</li>
          </ul>
          <p className="font-semibold">Sync with Apple Notes </p>
          <p>
            Create a new note in Apple Notes called{' '}
            <span className="font-semibold">Daily Notes</span> and start writing
            start writing each day&apos;s notes in it. Start every day with the
            current date in the format of DD/MM (eg: 22/04).
          </p>
          <p className="font-semibold">Shortcuts</p>

          <div className="flex flex-row gap-4">
            <p>
              Notes:{' '}
              <kbd className="px-1.5 py-0.5 bg-amber-200 rounded">⌘ I</kbd>{' '}
            </p>
            <p>
              Reads:{' '}
              <kbd className="px-1.5 py-0.5 bg-amber-200 rounded">⌘ L</kbd>{' '}
            </p>
            <p>
              Watchlist:{' '}
              <kbd className="px-1.5 py-0.5 bg-amber-200 rounded">⌘ K</kbd>{' '}
            </p>
          </div>
          <p>
            Need inspiration? Read this short blog from Andrej Karpthy to learn
            his style of daily note taking.
            <a
              href="https://karpathy.bearblog.dev/the-append-and-review-note/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              link
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
