import React, { JSX } from 'react';
import { Lock } from 'lucide-react';


interface NoteEditorProps {
  date: string;
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly: boolean;
}

function NoteEditor({
  date,
  content,
  onChange,
  readOnly = false,
}: NoteEditorProps): JSX.Element {
  return (
    <div className="flex flex-col items-center h-screen p-6 text-black flex-1">
      <div className="flex flex-row text-sm font-normal w-3/5 mb-3 opacity-60">
        <p>{date}</p>
        {readOnly && (
          <span className="ml-2 text-amber-600">
            <Lock className="h-4 w-4" />
          </span>
        )}
      </div>
      <textarea
        className={`p-3 text-black rounded-lg w-3/5 focus:outline-none text-sm ${
          readOnly ? 'bg-gray-100' : ''
        }`}
        value={content}
        onChange={onChange}
        placeholder="Start typing your notes here..."
        readOnly={readOnly}
      />
    </div>
  );
}

export default NoteEditor;
