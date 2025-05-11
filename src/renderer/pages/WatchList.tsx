import { useState, useEffect } from 'react';
import { RefreshCw, Film } from 'lucide-react';
import {
  getWatchItems,
  toggleWatchItem,
  WatchItem,
  extractWatchesFromAllNotes,
} from '../lib/watchUtils';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components/ui/tabs';
import WatchListItem from '../components/watches/WatchListItem';
import PageNav from '../components/shared/PageNav';

// Watch items list component
function WatchItemsList({
  items,
  onToggle,
}: {
  items: WatchItem[];
  onToggle: (id: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <WatchListItem item={item} onToggle={onToggle} />
        </li>
      ))}
    </ul>
  );
}

export default function WatchList() {
  const [watchItems, setWatchItems] = useState<WatchItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'done' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Function to load watch items and scan notes
  const loadWatchItems = () => {
    setIsLoading(true);

    // Scan all notes for potential watch items
    extractWatchesFromAllNotes();

    // Then get the updated list with any items that were found
    const allItems = getWatchItems();
    setWatchItems(allItems);
    setIsLoading(false);
  };

  // Load watch items from localStorage and scan all notes for watches
  useEffect(() => {
    loadWatchItems();
  }, []);

  // Handle toggling a watch item's done status
  const handleToggle = (id: string) => {
    const updatedItems = toggleWatchItem(id);
    setWatchItems(updatedItems);
  };

  // Count of items by status
  const pendingCount = watchItems.filter((item) => !item.done).length;
  const doneCount = watchItems.filter((item) => item.done).length;

  // Filtered items based on current tab
  const allItems = watchItems;
  const pendingItems = watchItems.filter((item) => !item.done);
  const doneItems = watchItems.filter((item) => item.done);

  const navButtons = [
    {
      id: 'refresh',
      icon: (
        <RefreshCw
          className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
        />
      ),
      onClick: loadWatchItems,
      title: 'Scan all notes for watching items',
      disabled: isLoading,
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      <PageNav buttons={navButtons} />

      <div className="flex flex-col items-center w-full max-w-4xl mx-auto pt-16 px-6 pb-6 h-screen">
        <div className="w-full max-w-xl items-center mb-6">
          <h1 className="text-md font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <Film className="h-5 w-5 text-amber-600" />
            Watch List
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
                All ({watchItems.length})
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className={
                  filter === 'pending' ? 'bg-amber-200 text-amber-800' : ''
                }
              >
                To Watch ({pendingCount})
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
                    <p>No watching items found</p>
                    <p className="text-sm mt-2">
                      Add items to your notes with &quot;Watch:&quot; prefix
                    </p>
                  </div>
                ) : (
                  <WatchItemsList items={allItems} onToggle={handleToggle} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="w-full min-h-[300px] flex-1 overflow-auto">
                {pendingItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-60 text-gray-500">
                    <p>No pending watching items</p>
                    <p className="text-sm mt-2">
                      Add items to your notes with &quot;Watch:&quot; prefix
                    </p>
                  </div>
                ) : (
                  <WatchItemsList
                    items={pendingItems}
                    onToggle={handleToggle}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="done">
              <div className="w-full min-h-[300px] flex-1 overflow-auto">
                {doneItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-60 text-gray-500">
                    <p>No completed watching items</p>
                    <p className="text-sm mt-2">
                      Add items to your notes with &quot;Watch:&quot; prefix
                    </p>
                  </div>
                ) : (
                  <WatchItemsList items={doneItems} onToggle={handleToggle} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
