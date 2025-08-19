import { FilesystemItem } from '../types';
import { DiscoveredAppDefinition } from '../contexts/AppContext';
import * as FsService from '../../services/filesystemService';

type OpenAppFunction = (appIdentifier: string | DiscoveredAppDefinition, initialData?: any) => void;

// A centralized function to handle opening any file-like item
export const openFile = async (
  item: FilesystemItem,
  openApp: OpenAppFunction,
  navigateTo?: (path: string) => void, // For navigating folders in File Explorer
) => {
  // Handle shortcuts
  if (item.name.endsWith('.lnk.json')) {
    try {
      const content = await FsService.readFile(item.path);
      if (content) {
        const shortcut = JSON.parse(content.content);
        if (shortcut.shortcutTo) {
          // It's a shortcut, now we need to find the actual item it points to.
          // This requires knowing the directory of the target path.
          const dirname = shortcut.shortcutTo.substring(0, shortcut.shortcutTo.lastIndexOf('/')) || '/';
          const filename = shortcut.shortcutTo.substring(shortcut.shortcutTo.lastIndexOf('/') + 1);
          const dirItems = await FsService.listDirectory(dirname);
          const targetItem = dirItems.find(i => i.name === filename);
          if (targetItem) {
            // Recursively call openFile with the actual item
            return openFile(targetItem, openApp, navigateTo);
          }
        }
      }
    } catch (e) {
      console.error("Could not open shortcut", e);
      alert("Could not open shortcut. The target may have been moved or deleted.");
    }
    return;
  }

  // Handle folders
  if (item.type === 'folder') {
    // If a navigate function is provided (i.e., we are in File Explorer), use it.
    if (navigateTo) {
      navigateTo(item.path);
    } else {
      // Otherwise (i.e., on the Desktop), open in a new File Explorer window.
      openApp('fileExplorer', { initialPath: item.path });
    }
    return;
  }

  // Handle application shortcuts
  if (item.name.endsWith('.app') && item.content) {
    try {
      openApp(JSON.parse(item.content));
    } catch (e) { console.error("Could not parse app shortcut", e); }
    return;
  }

  // Handle regular files (default to Notebook)
  if (item.type === 'file') {
    openApp('notebook', { file: { path: item.path, name: item.name } });
    return;
  }
};
