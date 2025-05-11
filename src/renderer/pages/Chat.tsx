import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import ChatInput from '../components/chat/ChatInput';
import PageNav from '../components/shared/PageNav';
import ChatSettings from '../components/chat/ChatSettings';

function Chat(): React.ReactElement {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSubmit = (message: string) => {
    console.log('Message submitted:', message);
    // Handle message submission here
  };

  const navButtons = [
    {
      id: 'help',
      icon: <HelpCircle className="h-3.5 w-3.5" />,
      onClick: () => setIsSettingsOpen(true),
      title: 'Help',
      disabled: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 text-black">
      <PageNav buttons={navButtons} />
      <div className="flex-1">{/* Chat messages will go here */}</div>
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent pb-4 pt-8">
        <ChatInput onSubmit={handleSubmit} />
      </div>
      <ChatSettings isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
    </div>
  );
}

export default Chat;
