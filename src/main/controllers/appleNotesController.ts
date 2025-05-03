import { ipcMain } from 'electron';
import {
  fetchAppleNote,
  fetchTodaysAppleNoteContent,
} from '../services/appleNotesService';

/**
 * Sets up IPC handlers for Apple Notes functionality
 */
export function setupAppleNotesHandlers() {
  ipcMain.handle('fetch-apple-note', async (_, noteName: string) => {
    console.log('Fetching Apple Note:', noteName);
    return fetchAppleNote(noteName);
  });

  ipcMain.handle('fetch-todays-apple-note', async (_, noteName: string) => {
    console.log('Fetching Apple Note content:', noteName);
    return fetchTodaysAppleNoteContent(noteName);
  });
}

export default setupAppleNotesHandlers;
