import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle, Circle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getReadItems,
  toggleReadItem,
  ReadItem,
  extractReadsFromAllNotes,
} from '../lib/readUtils';

export default function Reads() {
  const [readItems, setReadItems] = useState<ReadItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'done' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Function to load read items and scan notes
  const loadReadItems = () => {
    setIsLoading(true);

    // Scan all notes for potential read items
    extractReadsFromAllNotes();

    // Then get the updated list with any items that were found
    const allItems = getReadItems();
    setReadItems(allItems);
    setIsLoading(false);
  };

  // Load read items from localStorage and scan all notes for reads
  useEffect(() => {
    loadReadItems();
  }, []);

  // Handle toggling a read item's done status
  const handleToggle = (id: string) => {
    const updatedItems = toggleReadItem(id);
    setReadItems(updatedItems);
  };

  // Filter items based on current filter
  const filteredItems = readItems.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'done') return item.done;
    if (filter === 'pending') return !item.done;
    return true;
  });

  // Count of items by status
  const pendingCount = readItems.filter((item) => !item.done).length;
  const doneCount = readItems.filter((item) => item.done).length;

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      {/* Top navigation */}
      <div className="fixed top-3 right-3 flex gap-2 z-10 text-xs">
        <Link
          to="/"
          className="p-1 rounded flex items-center justify-center opacity-60 hover:opacity-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={loadReadItems}
          className="p-1.5 rounded-md bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
          title="Scan all notes for reading items"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      <div className="flex flex-col items-center pt-16 px-6 pb-6 h-screen">
        <div className="w-3/5 mb-6">
          <h1 className="text-xl font-semibold mb-4">Reading List</h1>

          <div className="flex space-x-2 mb-4">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'all'
                  ? 'bg-amber-200 text-amber-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              All ({readItems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'pending'
                  ? 'bg-amber-200 text-amber-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              To Read ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('done')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'done'
                  ? 'bg-amber-200 text-amber-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Completed ({doneCount})
            </button>
          </div>
        </div>

        <div className="w-3/5 flex-1 overflow-auto">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>No reading items found</p>
              <p className="text-sm mt-2">
                Add items to your notes with &quot;Read:&quot; prefix
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredItems.map((item) => (
                <li
                  key={item.id}
                  className={`p-3 rounded-lg border ${
                    item.done ? 'bg-amber-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start">
                    <button
                      type="button"
                      onClick={() => handleToggle(item.id)}
                      className="mt-1 mr-3 text-amber-600"
                    >
                      {item.done ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`${
                          item.done
                            ? 'line-through text-gray-500'
                            : 'text-black'
                        }`}
                      >
                        {item.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Added on{' '}
                        {format(parseISO(item.dateAdded), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
