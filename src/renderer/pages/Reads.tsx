import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, BookOpen } from 'lucide-react';
import {
  getReadItems,
  toggleReadItem,
  ReadItem,
  extractReadsFromAllNotes,
} from '../lib/readUtils';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components/ui/tabs';
import ReadListItem from '../components/reads/ReadListItem';

// Read items list component
function ReadItemsList({
  items,
  onToggle,
}: {
  items: ReadItem[];
  onToggle: (id: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <ReadListItem item={item} onToggle={onToggle} />
        </li>
      ))}
    </ul>
  );
}

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

  // Count of items by status
  const pendingCount = readItems.filter((item) => !item.done).length;
  const doneCount = readItems.filter((item) => item.done).length;

  // Filtered items based on current tab
  const allItems = readItems;
  const pendingItems = readItems.filter((item) => !item.done);
  const doneItems = readItems.filter((item) => item.done);

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      {/* Top navigation */}
      <div className="fixed top-3 right-3 flex gap-2 z-10 text-xs">
        <Link
          to="/"
          className="p-1 rounded flex items-center justify-center opacity-60 hover:opacity-100"
        >
          <Home className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={loadReadItems}
          className="p-1.5 rounded-md bg-amber-200 text-amber-800 hover:bg-amber-300 transition-colors"
          title="Scan all notes for reading items"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl mx-auto pt-16 px-6 pb-6 h-screen">
        <div className="w-full max-w-xl items-center mb-6">
          <h1 className="text-md font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            Reading List
          </h1>

          <Tabs
            defaultValue="all"
            onValueChange={(value) =>
              setFilter(value as 'all' | 'done' | 'pending')
            }
            className="min-w-[600px]"
          >
            <TabsList className="bg-gray-100 gap-2 w-full flex justify-center">
              <TabsTrigger
                value="all"
                className={
                  filter === 'all' ? 'bg-amber-200 text-amber-800' : ''
                }
              >
                All ({readItems.length})
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className={
                  filter === 'pending' ? 'bg-amber-200 text-amber-800' : ''
                }
              >
                To Read ({pendingCount})
              </TabsTrigger>
              <TabsTrigger
                value="done"
                className={
                  filter === 'done' ? 'bg-amber-200 text-amber-800' : ''
                }
              >
                Completed ({doneCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="w-full min-h-[300px] flex-1 overflow-auto">
                {allItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-60 text-gray-500">
                    <p>No reading items found</p>
                    <p className="text-sm mt-2">
                      Add items to your notes with &quot;Read:&quot; prefix
                    </p>
                  </div>
                ) : (
                  <ReadItemsList items={allItems} onToggle={handleToggle} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="w-full min-h-[300px] flex-1 overflow-auto">
                {pendingItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-60 text-gray-500">
                    <p>No pending reading items</p>
                    <p className="text-sm mt-2">
                      Add items to your notes with &quot;Read:&quot; prefix
                    </p>
                  </div>
                ) : (
                  <ReadItemsList items={pendingItems} onToggle={handleToggle} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="done">
              <div className="w-full min-h-[300px] flex-1 overflow-auto">
                {doneItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-60 text-gray-500">
                    <p>No completed reading items</p>
                    <p className="text-sm mt-2">
                      Add items to your notes with &quot;Read:&quot; prefix
                    </p>
                  </div>
                ) : (
                  <ReadItemsList items={doneItems} onToggle={handleToggle} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
