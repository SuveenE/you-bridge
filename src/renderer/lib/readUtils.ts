import { format } from 'date-fns';

export interface ReadItem {
  id: string;
  text: string;
  done: boolean;
  dateAdded: string;
}

// Extract reading items from note content
export function extractReadItems(content: string): ReadItem[] {
  // If no content, return empty array
  if (!content) return [];

  // Split content by lines
  const lines = content.split('\n');

  // Extract lines containing "Read:"
  return lines
    .filter((line) => line.includes('Read:'))
    .map((line) => {
      // Extract the text after "Read:"
      const text = line.substring(line.indexOf('Read:') + 5).trim();

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

// Save read items to localStorage
export function saveReadItems(items: ReadItem[]): void {
  localStorage.setItem('readItems', JSON.stringify(items));
}

// Get read items from localStorage
export function getReadItems(): ReadItem[] {
  const items = localStorage.getItem('readItems');
  if (!items) return [];

  try {
    return JSON.parse(items);
  } catch (error) {
    console.error('Error parsing read items:', error);
    return [];
  }
}

// Toggle a read item's done status
export function toggleReadItem(id: string): ReadItem[] {
  const items = getReadItems();
  const updatedItems = items.map((item) =>
    item.id === id ? { ...item, done: !item.done } : item,
  );

  saveReadItems(updatedItems);
  return updatedItems;
}

// Add new read items, avoiding duplicates
export function addReadItems(newItems: ReadItem[]): ReadItem[] {
  const currentItems = getReadItems();

  // Filter out items that already exist (based on text)
  const uniqueNewItems = newItems.filter(
    (newItem) => !currentItems.some((item) => item.text === newItem.text),
  );

  if (uniqueNewItems.length === 0) return currentItems;

  const updatedItems = [...currentItems, ...uniqueNewItems];
  saveReadItems(updatedItems);
  return updatedItems;
}

// Extract read items from all existing notes
export function extractReadsFromAllNotes(): ReadItem[] {
  try {
    // Get all saved notes
    const savedNotes = localStorage.getItem('notes');
    if (!savedNotes) return [];

    const parsedNotes = JSON.parse(savedNotes);
    if (!Array.isArray(parsedNotes)) return [];

    // Extract read items from each note
    const allReadItems: ReadItem[] = [];

    parsedNotes.forEach((note: { date: string; content: string }) => {
      const readItemsFromNote = extractReadItems(note.content);

      // Use the note's date as the dateAdded for these items
      const updatedItems = readItemsFromNote.map((item) => ({
        ...item,
        dateAdded: note.date,
      }));

      allReadItems.push(...updatedItems);
    });

    // Add all found items
    return addReadItems(allReadItems);
  } catch (error) {
    console.error('Error extracting reads from notes:', error);
    return [];
  }
}
