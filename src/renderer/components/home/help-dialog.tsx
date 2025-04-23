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
import { HowToTab, SettingsTab } from './help-dialog-tabs';

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
          <HowToTab switchToSettings={switchToSettings} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab
            noteName={noteName}
            setNoteName={setNoteName}
            saveSuccess={saveSuccess}
            saveSettings={saveSettings}
          />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}

function HelpDialog({ initialTab, iconType = 'help' }: HelpDialogProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [noteName, setNoteName] = useState('Daily Notes');
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
  }, [iconType]);

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
        <div className="p-1 rounded-md flex items-center justify-center text-gray-800 hover:text-amber-600 bg-transparent shadow-none cursor-pointer">
          {icon === 'help' ? (
            <HelpCircle size={18} strokeWidth={2.5} />
          ) : (
            <Settings size={18} strokeWidth={2.5} />
          )}
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
