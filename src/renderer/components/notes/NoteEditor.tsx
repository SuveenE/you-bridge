import React, { JSX } from 'react';
import { format } from 'date-fns';

interface NoteEditorProps {
  date: Date;
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function NoteEditor({ date, content, onChange }: NoteEditorProps): JSX.Element {
  return (
    <div className="flex flex-col items-center h-screen p-6 text-black flex-1">
      <div className="text-sm font-normal w-3/5 mb-3 opacity-60">
        {format(date, 'MMMM d, yyyy')}
      </div>
      <textarea
        className="p-3 text-black rounded-lg w-3/5 focus:outline-none text-sm"
        value={content}
        onChange={onChange}
        placeholder="Start typing your notes here..."
      />
    </div>
  );
}

export default NoteEditor;
