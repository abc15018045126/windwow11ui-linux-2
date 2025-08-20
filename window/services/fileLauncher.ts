import { FilesystemItem } from '@kernel/types';
import { DiscoveredAppDefinition } from '@kernel/contexts/AppContext';
import * as FsService from '@/services/filesystemService';

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
          const dirname = shortcut.shortcutTo.substring(0, shortcut.shortcutTo.lastIndexOf('/')) || '/';
          const filename = shortcut.shortcutTo.substring(shortcut.shortcutTo.lastIndexOf('/') + 1);
          const dirItems = await FsService.listDirectory(dirname);
          const targetItem = dirItems.find(i => i.name === filename);
          if (targetItem) {
            return openFile(targetItem, openApp, navigateTo);
          } else {
            alert(`Shortcut target not found: ${shortcut.shortcutTo}`);
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
    // Check if the folder is an application
    const dirItems = await FsService.listDirectory(item.path);
    const appFile = dirItems.find(i => i.name === `${item.name}.tsx`);
    if (appFile) {
      openApp(item.name);
      return;
    }

    if (navigateTo) {
      navigateTo(item.path);
    } else {
      openApp('fileExplorer', { initialPath: item.path });
    }
    return;
  }


  // Handle regular files (default to Notebook)
  if (item.type === 'file') {
    openApp('notebook', { file: { path: item.path, name: item.name } });
    return;
  }
};
