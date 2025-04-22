import { Button } from '../ui/button';

// HowTo tab component
export function HowToTab({
  switchToSettings,
}: {
  switchToSettings: () => void;
}) {
  return (
    <div className="mt-4 space-y-4 text-left">
      <div>
        <h3 className="font-bold text-gray-800">Taking Notes</h3>
        <p className="text-sm text-gray-600 mt-1">
          Click &quot;Notes&quot; button and you can start taking notes for the day.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-gray-800">Apple Notes Sync</h3>
        <p className="text-sm text-gray-600 mt-1">
          To sync with Apple Notes, go to{' '}
          <span
            role="button"
            onClick={switchToSettings}
            className="text-amber-700 font-medium hover:underline cursor-pointer"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                switchToSettings();
              }
            }}
          >
            Settings
          </span>{' '}
          and add your Apple Note name.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-gray-800">Reading & Watch Lists</h3>
        <p className="text-sm text-gray-600 mt-1">
          Track your reading materials and movies/shows you want to watch. Mark
          items as complete when finished. When adding items to your notes, use
          &quot;Read: XXX&quot; for reading materials and &quot;Watch: XXX&quot;
          for videos.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-gray-800">Calendar Overview</h3>
        <p className="text-sm text-gray-600 mt-1">
          The calendar shows your note-taking activity:
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>
              <span className="bg-[#86efac] px-2 py-0.5 rounded-sm">.</span> -
              Days with notes
            </li>
            <li>
              <span className="bg-[#fde68a] px-2 py-0.5 rounded-sm">.</span> -
              Today
            </li>
            <li>
              <span className="bg-[#fca5a5] px-2 py-0.5 rounded-sm">.</span> -
              Past days without notes
            </li>
          </ul>
        </p>
      </div>
    </div>
  );
}

// Settings tab component
export function SettingsTab({
  noteName,
  setNoteName,
  saveSuccess,
  saveSettings,
}: {
  noteName: string;
  setNoteName: (name: string) => void;
  saveSuccess: boolean;
  saveSettings: () => void;
}) {
  return (
    <div className="mt-4 space-y-4 text-left">
      <div>
        <h3 className="font-bold text-gray-800">Apple Note Name</h3>
        <p className="text-sm text-gray-600 mt-1">
          Enter the name of your Apple Note to fetch
        </p>
        <input
          type="text"
          value={noteName}
          onChange={(e) => setNoteName(e.target.value)}
          className="w-full mt-2 p-2.5 bg-white text-sm border border-gray-300 rounded-md
                    shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500
                    focus:border-transparent text-gray-900"
          placeholder="e.g. Suveen Daily Notes"
        />
      </div>

      <div>
        <h3 className="font-bold text-gray-800">Note Format</h3>
        <p className="text-sm text-gray-600 mt-1">
          When typing notes for a particular day start with a date marker. e.g.{' '}
          <span className="font-bold"> 20/04</span> and add your notes from the
          next new line onwards.
        </p>
      </div>

      <div className="flex justify-end items-center">
        {saveSuccess && (
          <span className="text-green-600 text-xs mr-3">
            Settings saved successfully!
          </span>
        )}
        <Button
          type="button"
          onClick={saveSettings}
          className="bg-amber-200 hover:bg-amber-300 text-gray-900 font-medium"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
