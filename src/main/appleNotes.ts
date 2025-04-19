import { promisify } from 'util';
import { exec } from 'child_process';
import { ipcMain } from 'electron';

const execPromise = promisify(exec);

/**
 * Fetches notes from the Apple Notes app using AppleScript
 * @param noteName The name of the note/folder to search for
 * @returns The content of the note or null if not found
 */
async function fetchAppleNote(noteName: string): Promise<string | null> {
  try {
    // AppleScript to get the content of a specific note
    const script = `
      tell application "Notes"
        set foundNotes to notes whose name contains "${noteName}"
        if length of foundNotes > 0 then
          set targetNote to item 1 of foundNotes
          return body of targetNote
        else
          return "Note not found"
        end if
      end tell
    `;

    const { stdout } = await execPromise(`osascript -e '${script}'`);

    if (stdout.trim() === 'Note not found') {
      return null;
    }

    return stdout.trim();
  } catch (error) {
    console.error('Error fetching Apple Note:', error);
    return null;
  }
}

/**
 * Fetches today's entries from an Apple Note
 * @param noteName The name of the note to search for
 * @returns Today's content or null if not found
 */
async function fetchTodaysAppleNoteContent(
  noteName: string,
): Promise<string | null> {
  try {
    const today = new Date();

    // More advanced AppleScript to extract content with dates
    const script = `
      tell application "Notes"
        set foundNotes to notes whose name contains "${noteName}"
        if length of foundNotes > 0 then
          set targetNote to item 1 of foundNotes
          set noteBody to body of targetNote

          -- Today's date in format that matches note timestamps
          set todayDate to (current date)
          set todayDay to day of todayDate as integer
          set todayMonth to month of todayDate as integer
          set todayYear to year of todayDate as integer

          -- Return the note content with special markers
          return noteBody
        else
          return "Note not found"
        end if
      end tell
    `;

    const { stdout } = await execPromise(`osascript -e '${script}'`);

    if (stdout.trim() === 'Note not found') {
      return null;
    }

    // Process the note content to extract today's entries
    const content = stdout.trim();
    const lines = content.split('\n');
    const todayContent: string[] = [];
    let isInTodaySection = false;
    const todayDatePattern = new RegExp(
      `\\b${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}\\b`,
    );

    // Common date formats in notes
    const datePatterns = [
      // MM/DD/YYYY
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/,
      // Month D, YYYY
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/i,
      // YYYY-MM-DD
      /\b\d{4}-\d{2}-\d{2}\b/,
    ];

    // Use array methods instead of for loop
    lines.forEach((line) => {
      // Check if line contains a date marker
      const hasDateMarker = datePatterns.some((pattern) => pattern.test(line));

      if (hasDateMarker) {
        // If it matches today's date, start collecting
        isInTodaySection = todayDatePattern.test(line);
        if (isInTodaySection) {
          todayContent.push(line);
        }
      } else if (isInTodaySection) {
        todayContent.push(line);
      }
    });

    console.log('todayContent', todayContent);

    return todayContent.length > 0 ? todayContent.join('\n') : null;
  } catch (error) {
    console.error("Error fetching today's Apple Note content:", error);
    return null;
  }
}

// Set up IPC handlers
export function setupAppleNotesHandlers() {
  ipcMain.handle('fetch-apple-note', async (_, noteName: string) => {
    return fetchAppleNote(noteName);
  });

  ipcMain.handle('fetch-todays-apple-note', async (_, noteName: string) => {
    return fetchTodaysAppleNoteContent(noteName);
  });
}

export default setupAppleNotesHandlers;
