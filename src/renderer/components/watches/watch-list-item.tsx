import React from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle, Circle } from 'lucide-react';
import { WatchItem } from '../../lib/watchUtils';

interface WatchListItemProps {
  item: WatchItem;
  onToggle: (id: string) => void;
}

function WatchListItem({ item, onToggle }: WatchListItemProps) {
  // Function to check if text contains a URL
  const extractUrl = (text: string): string | null => {
    const urlRegex = /(https?:\/\/[^\s]+)/;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  };

  const url = extractUrl(item.text);
  const handleLinkClick = (e: React.MouseEvent, linkUrl: string) => {
    e.stopPropagation();
    window.open(linkUrl, '_blank');
  };

  return (
    <div
      className={`p-3 rounded-lg border ${
        item.done ? 'bg-amber-50' : 'bg-white'
      }`}
    >
      <div className="flex items-center">
        <div
          role="button"
          onClick={() => onToggle(item.id)}
          className="mr-3 text-amber-600 flex-shrink-0"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onToggle(item.id);
            }
          }}
        >
          {item.done ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            {url && (
              <div className="mt-1.5 flex items-center">
                <div
                  onClick={(e) => handleLinkClick(e, url)}
                  className="inline-flex items-center text-amber-600 hover:text-amber-800 flex-shrink-0"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      // Handle keyboard event separately from mouse event
                      e.stopPropagation();
                      window.open(url, '_blank');
                    }
                  }}
                >
                  <p className="text-xs text-gray-600 truncate mr-2 underline">
                    {url}
                  </p>
                  <p className="text-xs text-gray-500 flex-shrink-0">
                    {format(parseISO(item.dateAdded), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}
            {!url && (
              <p className="text-xs text-gray-500 mt-1">
                {format(parseISO(item.dateAdded), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchListItem;
