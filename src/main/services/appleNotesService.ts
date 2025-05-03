import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

/**
 * Strips HTML tags from text and removes the title
 * @param htmlString Text with HTML tags
 * @param noteName Name of the note to remove from content
 * @returns Plain text without HTML tags and title
 */
function stripHtml(htmlString: string, noteName: string = ''): string {
  // First normalize line breaks in the HTML
  let text = htmlString
    // Replace common block-level ending tags with a linebreak only if needed
    .replace(/<\/p>\s*<p>/gi, '\n')
    .replace(/<\/div>\s*<div>/gi, '\n')
    .replace(/<\/li>\s*<li>/gi, '\n')
    .replace(/<\/h[1-6]>\s*<h[1-6]>/gi, '\n')
    // Remove other linebreak-causing tags without adding breaks
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '')
    .replace(/<\/div>/gi, '')
    .replace(/<\/h[1-6]>/gi, '')
    .replace(/<\/li>/gi, '');

  // Replace remaining HTML tags with empty string (not spaces)
  text = text.replace(/<[^>]*>/g, '');

  // Replace multiple spaces with a single space
  text = text.replace(/[ \t]+/g, ' ');

  // Replace HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Normalize line breaks - remove consecutive extra line breaks
  // but maintain original single line breaks
  text = text.replace(/\n{3,}/g, '\n\n');

  // Remove the note title if it appears at the beginning of the content
  if (noteName) {
    // Look for exact title or title with formatting at the beginning
    const titleRegex = new RegExp(`^\\s*${noteName}\\s*\\n`, 'i');
    text = text.replace(titleRegex, '');

    // Also try with different case (case insensitive)
    const simpleTitleRegex = new RegExp(`^\\s*${noteName}\\s*$`, 'im');
    const lines = text.split('\n');
    if (lines.length > 0 && simpleTitleRegex.test(lines[0])) {
      lines.shift();
      text = lines.join('\n');
    }
  }

  return text.trim();
}

/**
 * Fetches notes from the Apple Notes app using AppleScript
 * @param noteName The name of the note/folder to search for
 * @returns The content of the note or null if not found
 */
export async function fetchAppleNote(noteName: string): Promise<string | null> {
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

    // Strip HTML tags from the content and remove title
    return stripHtml(stdout.trim(), noteName);
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
export async function fetchTodaysAppleNoteContent(
  noteName: string,
): Promise<string | null> {
  try {
    // Improved AppleScript to extract note content
    const script = `
      tell application "Notes"
        set foundNotes to notes whose name contains "${noteName}"
        if length of foundNotes > 0 then
          set targetNote to item 1 of foundNotes
          set noteBody to body of targetNote
          return noteBody
        else
          return "Note not found"
        end if
      end tell
    `;

    const { stdout } = await execPromise(`osascript -e '${script}'`);

    if (stdout.trim() === 'Note not found') {
      console.error('Note not found:', noteName);
      return null;
    }

    // Strip HTML tags and return the plain text content, removing title
    console.log('Found note, stripping HTML and returning content');
    return stripHtml(stdout.trim(), noteName);
  } catch (error) {
    console.error('Error fetching Apple Note content:', error);
    return null;
  }
}
