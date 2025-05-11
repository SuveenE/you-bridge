import {
  app,
  Menu,
  BrowserWindow,
  MenuItemConstructorOptions,
  dialog,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  private updateAvailable: boolean = false;

  private menu: Menu | null = null;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.setupUpdateEvents();
  }

  private setupUpdateEvents(): void {
    autoUpdater.on('update-downloaded', () => {
      this.updateAvailable = true;
      this.updateMenu();
    });

    autoUpdater.on('update-not-available', () => {
      this.updateAvailable = false;
      this.updateMenu();
    });
  }

  private updateMenu(): void {
    if (this.menu) {
      const template =
        process.platform === 'darwin'
          ? this.buildDarwinTemplate()
          : this.buildDefaultTemplate();
      const newMenu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(newMenu);
      this.menu = newMenu;
    }
  }

  async checkForUpdates() {
    try {
      log.info('Checking for updates...');
      const result = await autoUpdater.checkForUpdates();

      if (!result?.updateInfo) {
        dialog.showMessageBox(this.mainWindow, {
          type: 'info',
          title: 'No Updates',
          message: 'You are up to date!',
          detail: 'No new versions are available.',
          buttons: ['OK'],
        });
        return;
      }

      const { version: latestVersion } = result.updateInfo;
      const currentVersion = app.getVersion();

      if (latestVersion === currentVersion) {
        dialog.showMessageBox(this.mainWindow, {
          type: 'info',
          title: 'No Updates',
          message: 'You are up to date!',
          detail: `Current version: ${currentVersion}`,
          buttons: ['OK'],
        });
        return;
      }

      log.info('New version found, downloading update...');
      await autoUpdater.downloadUpdate();

      const response = await dialog.showMessageBox(this.mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: 'A new version has been downloaded',
        detail:
          'The update will be installed when you restart the application.',
        buttons: ['Restart Now', 'Later'],
        defaultId: 0,
      });

      if (response.response === 0) {
        log.info('User chose to restart now');
        autoUpdater.quitAndInstall(true, true);
      }
    } catch (error) {
      log.error('Error during update process:', error);
      dialog.showErrorBox(
        'Update Error',
        'Failed to check or download updates. Please try again later.',
      );
    }
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    this.menu = menu;

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'NoteStack',
      submenu: [
        {
          label: 'About NoteStack',
          selector: 'orderFrontStandardAboutPanel:',
        },
        {
          label: this.updateAvailable
            ? 'Restart to Install Update'
            : 'Check for Updates...',
          click: async () => {
            if (this.updateAvailable) {
              log.info('Installing update...');
              autoUpdater.quitAndInstall(true, true);
            } else {
              await this.checkForUpdates();
            }
          },
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide NoteStack',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };

    const subMenuFile: DarwinMenuItemConstructorOptions = {
      label: 'File',
      submenu: [
        {
          label: 'New Note',
          accelerator: 'Command+N',
          click: () => {
            this.mainWindow.webContents.send('new-note');
          },
        },
      ],
    };

    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };

    const subMenuView: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };

    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };

    return [subMenuAbout, subMenuFile, subMenuEdit, subMenuView, subMenuWindow];
  }

  buildDefaultTemplate() {
    return [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu: [
          {
            label: '&Reload',
            accelerator: 'Ctrl+R',
            click: () => {
              this.mainWindow.webContents.reload();
            },
          },
          {
            label: 'Toggle &Full Screen',
            accelerator: 'F11',
            click: () => {
              this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
            },
          },
          {
            label: 'Toggle &Developer Tools',
            accelerator: 'Alt+Ctrl+I',
            click: () => {
              this.mainWindow.webContents.toggleDevTools();
            },
          },
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'About NoteStack',
            click: () => {
              dialog.showMessageBox(this.mainWindow, {
                type: 'info',
                title: 'About NoteStack',
                message: `NoteStack ${app.getVersion()}`,
                detail: 'Created by Suveen',
                buttons: ['OK'],
              });
            },
          },
          {
            label: this.updateAvailable
              ? 'Restart to Install Update'
              : 'Check for Updates...',
            click: async () => {
              if (this.updateAvailable) {
                log.info('Installing update...');
                autoUpdater.quitAndInstall(true, true);
              } else {
                await this.checkForUpdates();
              }
            },
          },
        ],
      },
    ];
  }
}
