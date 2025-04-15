import React, { JSX } from 'react';

interface NoteEditorProps {
  date: string;
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

function NoteEditor({
  date,
  content,
  onChange,
  readOnly = false,
}: NoteEditorProps): JSX.Element {
  return (
    <div className="flex flex-col items-center h-screen p-6 text-black flex-1">
      <div className="text-sm font-normal w-3/5 mb-3 opacity-60">
        {date}
        {readOnly && (
          <span className="ml-2 text-amber-600">
            (View only - cannot edit past notes)
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

NoteEditor.defaultProps = {
  readOnly: false,
};

export default NoteEditor;
