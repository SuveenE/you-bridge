import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import ChatInput from '../components/chat/ChatInput';

function Chat(): React.ReactElement {
  const handleSubmit = (message: string) => {
    console.log('Message submitted:', message);
    // Handle message submission here
  };

  return (
    <div className="container mx-auto px-4">
      <div className="fixed top-3 right-3 flex gap-2 z-10 text-xs">
        <Link
          to="/"
          className="p-1 rounded flex items-center justify-center opacity-60 hover:opacity-100"
        >
          <Home className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex-1">{/* Chat messages will go here */}</div>
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent pb-4 pt-8">
        <ChatInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default Chat;
