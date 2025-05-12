/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export class AppUpdater {
  constructor() {
    log.info('Initializing auto-updater');
    if (process.env.NODE_ENV === 'development') {
      autoUpdater.forceDevUpdateConfig = true;
      log.info('Development mode: Forcing dev update config');
    }
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    try {
      this.listenEvents();
      log.info('Checking for updates on startup');
      this.checkForUpdates().catch((err) => {
        log.error('Failed to check for updates on startup:', err);
      });
    } catch (error) {
      log.error('Error initializing auto-updater:', error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async checkForUpdates(): Promise<void> {
    try {
      await autoUpdater.checkForUpdates();
    } catch (error) {
      log.error('Error checking for updates:', error);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async listenEvents(): Promise<void> {
    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
      log.info('Update available:', {
        version: info.version,
        releaseDate: info.releaseDate,
        files: info.files,
      });
      autoUpdater.downloadUpdate().catch((err) => {
        log.error('Failed to download update:', err);
      });
    });

    autoUpdater.on('update-not-available', (info) => {
      log.info('Update not available. Current version is latest:', {
        version: info.version,
        releaseDate: info.releaseDate,
      });
    });

    autoUpdater.on('error', (err) => {
      log.error('Error in auto-updater:', err);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      log.info('Download progress:', {
        progress: `${progressObj.percent}%`,
        speed: `${progressObj.bytesPerSecond} bytes/s`,
        transferred: `${progressObj.transferred}/${progressObj.total} bytes`,
      });
    });

    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded successfully:', {
        version: info.version,
        releaseDate: info.releaseDate,
        files: info.files,
      });
    });
  }
}
