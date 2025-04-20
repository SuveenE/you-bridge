import { format } from 'date-fns';

export interface WatchItem {
  id: string;
  text: string;
  done: boolean;
  dateAdded: string;
}

// Extract watching items from note content
export function extractWatchItems(content: string): WatchItem[] {
  // If no content, return empty array
  if (!content) return [];

  // Split content by lines
  const lines = content.split('\n');

  // Extract lines containing "Watch:"
  return lines
    .filter((line) => line.includes('Watch:'))
    .map((line) => {
      // Extract the text after "Watch:"
      const text = line.substring(line.indexOf('Watch:') + 6).trim();

      // Create a unique ID based on text and current timestamp
      const id = `${text}-${Date.now()}`;

      return {
        id,
        text,
        done: false,
        dateAdded: format(new Date(), 'yyyy-MM-dd'),
      };
    });
}

// Save watch items to localStorage
export function saveWatchItems(items: WatchItem[]): void {
  localStorage.setItem('watchItems', JSON.stringify(items));
}

// Get watch items from localStorage
export function getWatchItems(): WatchItem[] {
  const items = localStorage.getItem('watchItems');
  if (!items) return [];

  try {
    return JSON.parse(items);
  } catch (error) {
    console.error('Error parsing watch items:', error);
    return [];
  }
}

// Toggle a watch item's done status
export function toggleWatchItem(id: string): WatchItem[] {
  const items = getWatchItems();
  const updatedItems = items.map((item) =>
    item.id === id ? { ...item, done: !item.done } : item,
  );

  saveWatchItems(updatedItems);
  return updatedItems;
}

// Add new watch items, avoiding duplicates
export function addWatchItems(newItems: WatchItem[]): WatchItem[] {
  const currentItems = getWatchItems();

  // Filter out items that already exist (based on text)
  const uniqueNewItems = newItems.filter(
    (newItem) => !currentItems.some((item) => item.text === newItem.text),
  );

  if (uniqueNewItems.length === 0) return currentItems;

  const updatedItems = [...currentItems, ...uniqueNewItems];
  saveWatchItems(updatedItems);
  return updatedItems;
}

// Extract watch items from all existing notes
export function extractWatchesFromAllNotes(): WatchItem[] {
  try {
    // Get all saved notes
    const savedNotes = localStorage.getItem('notes');
    if (!savedNotes) return [];

    const parsedNotes = JSON.parse(savedNotes);
    if (!Array.isArray(parsedNotes)) return [];

    // Extract watch items from each note
    const allWatchItems: WatchItem[] = [];

    parsedNotes.forEach((note: { date: string; content: string }) => {
      const watchItemsFromNote = extractWatchItems(note.content);

      // Use the note's date as the dateAdded for these items
      const updatedItems = watchItemsFromNote.map((item) => ({
        ...item,
        dateAdded: note.date,
      }));

      allWatchItems.push(...updatedItems);
    });

    // Add all found items
    return addWatchItems(allWatchItems);
  } catch (error) {
    console.error('Error extracting watches from notes:', error);
    return [];
  }
}
