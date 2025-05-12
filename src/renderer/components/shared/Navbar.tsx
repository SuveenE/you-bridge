import * as React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import HelpDialog from '../home/HelpDialog';

export function Navbar() {
  const [helpOpen, setHelpOpen] = React.useState(false);

  return (
    <div className="fixed top-3 right-3 flex gap-2 z-10 text-xs">
      <div>
        <Button
          variant="ghost"
          size="icon"
          className="bg-amber-200 text-gray-800 hover:bg-amber-300"
          onClick={() => setHelpOpen(true)}
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
      <HelpDialog isOpen={helpOpen} setIsOpen={setHelpOpen} />
    </div>
  );
}

export default Navbar;
