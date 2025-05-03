import React from 'react';

interface ChatHeaderProps {
  userName: string;
}

function ChatHeader({ userName }: ChatHeaderProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center space-y-4 py-8">
      <h1 className="text-4xl font-semibold text-[#2D2F52]">Hey {userName}</h1>
    </div>
  );
}

export default ChatHeader;
