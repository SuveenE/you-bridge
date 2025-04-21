import { useState, useEffect } from 'react';
import { HelpCircle, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';

// eslint-disable-next-line react/require-default-props
interface HelpDialogProps {
  initialTab: 'howto' | 'settings';
  iconType: 'help' | 'settings';
}

// Dialog content component
function HelpDialogContent({
  activeTab,
  setActiveTab,
  noteName,
  setNoteName,
  saveSuccess,
  saveSettings,
  switchToSettings,
}: {
  activeTab: 'howto' | 'settings';
  setActiveTab: (tab: 'howto' | 'settings') => void;
  noteName: string;
  setNoteName: (name: string) => void;
  saveSuccess: boolean;
  saveSettings: () => void;
  switchToSettings: () => void;
}) {
  return (
    <DialogContent className="sm:max-w-[425px] bg-amber-50 text-gray-800">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">
          How to use NoteStack
        </DialogTitle>
      </DialogHeader>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'howto' | 'settings')}
        className="mt-4"
      >
        <TabsList className="bg-gray-100 gap-2 w-full flex justify-center">
          <TabsTrigger
            value="howto"
            className={
              activeTab === 'howto' ? 'bg-amber-200 text-amber-800' : ''
            }
          >
            How to
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className={
              activeTab === 'settings' ? 'bg-amber-200 text-amber-800' : ''
            }
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="howto">
          <div className="mt-4 space-y-4 text-left">
            <div>
              <h3 className="font-bold text-gray-800">Taking Notes</h3>
              <p className="text-sm text-gray-600 mt-1">
                Click &quot;Notes&quot; button and you can start taking notes
                for the day.
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
                Track your reading materials and movies/shows you want to watch.
                Mark items as complete when finished. When adding items to your
                notes, use &quot;Read: XXX&quot; for reading materials and
                &quot;Watch: XXX&quot; for videos.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-800">Calendar Overview</h3>
              <p className="text-sm text-gray-600 mt-1">
                The calendar shows your note-taking activity:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>
                    <span className="bg-[#86efac] px-2 py-0.5 rounded-sm">
                      .
                    </span>{' '}
                    - Days with notes
                  </li>
                  <li>
                    <span className="bg-[#fde68a] px-2 py-0.5 rounded-sm">
                      .
                    </span>{' '}
                    - Today
                  </li>
                  <li>
                    <span className="bg-[#fca5a5] px-2 py-0.5 rounded-sm">
                      .
                    </span>{' '}
                    - Past days without notes
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="mt-4 space-y-5">
            <div className="text-left">
              <h3 className="text-sm font-bold text-gray-700">
                Apple Note Name
              </h3>
              <p className="text-xs text-gray-500 mt-1">
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

            <p className="text-xs text-gray-500">
              When typing notes for a particular day start with a date marker.
              e.g. <span className="font-bold"> 20/04</span> and add your notes
              from the next new line onwards.
            </p>

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
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}

function HelpDialog({ initialTab, iconType = 'help' }: HelpDialogProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [noteName, setNoteName] = useState('Suveen Daily Notes');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [icon, setIcon] = useState(iconType);

  // Load Apple Notes settings from local storage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appleNotesSettings');
    setIcon(iconType);
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.noteName) {
          setNoteName(settings.noteName);
        }
      } catch (error) {
        console.error('Error loading Apple Notes settings:', error);
      }
    }
  }, []);

  const switchToSettings = () => {
    setActiveTab('settings');
  };

  // Save Apple Note name to localStorage
  const saveSettings = () => {
    // Get existing settings to preserve todayOnly value
    let todayOnly = true; // Default value
    const savedSettings = localStorage.getItem('appleNotesSettings');
    if (savedSettings) {
      try {
        const currentSettings = JSON.parse(savedSettings);
        if (currentSettings.todayOnly !== undefined) {
          todayOnly = currentSettings.todayOnly;
        }
      } catch (error) {
        console.error('Error reading existing settings:', error);
      }
    }

    // Save with existing or default todayOnly value
    const settings = {
      noteName,
      todayOnly,
    };
    localStorage.setItem('appleNotesSettings', JSON.stringify(settings));

    // Show success message
    setSaveSuccess(true);
    // Hide after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-1 rounded flex items-center justify-center opacity-60 hover:opacity-100">
          {icon === 'help' ? <HelpCircle size={16} /> : <Settings size={16} />}
        </div>
      </DialogTrigger>
      <HelpDialogContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        noteName={noteName}
        setNoteName={setNoteName}
        saveSuccess={saveSuccess}
        saveSettings={saveSettings}
        switchToSettings={switchToSettings}
      />
    </Dialog>
  );
}

export default HelpDialog;
