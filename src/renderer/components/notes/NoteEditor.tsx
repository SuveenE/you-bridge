import React, { JSX, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  // Format the date to include day of week
  const formattedDate = date ? format(parseISO(date), 'EEEE, MMM d, yyyy') : '';

  return (
    <div className="flex flex-col items-center h-screen p-6 text-black flex-1">
      <div className="flex flex-row text-sm font-normal w-3/5 mb-3 opacity-60">
        <p>{formattedDate}</p>
        {readOnly && (
          <span className="ml-2 text-amber-600">
            <Lock className="h-4 w-4" />
          </span>
        )}
      </div>
      <textarea
        ref={textareaRef}
        className={`p-3 text-black rounded-lg w-3/5 focus:outline-none text-sm resize-none ${
          readOnly ? 'bg-gray-100' : ''
        }`}
        value={content}
        onChange={(e) => {
          onChange(e);
          adjustHeight();
        }}
        placeholder="Start typing your notes here..."
        readOnly={readOnly}
        rows={1}
      />
    </div>
  );
}

export default NoteEditor;
