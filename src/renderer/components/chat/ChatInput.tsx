import React from 'react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
}

function ChatInput({ onSubmit }: ChatInputProps): React.ReactElement {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4 min-h-20">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What do you want to do today?"
          className="flex-1 bg-white rounded-full px-6 py-3 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </form>
    </div>
  );
}

export default ChatInput;
