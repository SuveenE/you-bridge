import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

// Dialog component definition moved before it is used
type HelpDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function HelpDialog({ isOpen, setIsOpen }: HelpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-amber-50 text-gray-800">
        <DialogHeader>
          <DialogTitle>You bridge 🌉</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          {/* <p>
              Press <kbd className="px-1.5 py-0.5 bg-amber-200 rounded">⌘ I</kbd>
              and start taking notes for the current day.
            </p>
            <p className="font-semibold">Taking Notes</p> */}
          <p>
            Upload documents about you and expose it as a MCP server to any AI
            application.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
