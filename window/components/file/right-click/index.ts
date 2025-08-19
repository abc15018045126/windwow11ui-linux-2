import { FilesystemItem } from '@kernel/types';
import { ContextMenuItem } from '@kernel/components/ContextMenu';
import { DiscoveredAppDefinition } from '@kernel/contexts/AppContext';
import { handleNewFolder, handleNewFile } from './create';
import { handleDeleteItem } from './delete';
import { handleShowProperties } from './properties';
import { handleCreateShortcut } from './shortcut';
import { getOpenWithMenuItems } from '@kernel/components/app-store/openWith';

type OpenAppFunction = (appIdentifier: string | DiscoveredAppDefinition, initialData?: any) => void;

export interface MenuBuilderContext {
  clickedItem?: FilesystemItem;
  currentPath: string;
  apps: DiscoveredAppDefinition[];
  refresh: () => void;
  openApp: OpenAppFunction;
  onRename: (item: FilesystemItem) => void;
  onCopy: (item: FilesystemItem) => void;
  onCut: (item: FilesystemItem) => void;
  onPaste: (path: string) => void;
  onOpen: (item: FilesystemItem) => void;
  isPasteDisabled: boolean;
}

export const buildContextMenu = (context: MenuBuilderContext): ContextMenuItem[] => {
  const {
    clickedItem,
    currentPath,
    apps,
    refresh,
    openApp,
    onRename,
    onCopy,
    onCut,
    onPaste,
    onOpen,
    isPasteDisabled
  } = context;

  if (clickedItem) {
    const menuItems: ContextMenuItem[] = [];
    menuItems.push({ type: 'item', label: 'Open', onClick: () => onOpen(clickedItem) });

    if (clickedItem.type === 'file') {
        const openWithItems = getOpenWithMenuItems(apps, clickedItem, openApp);
        if (openWithItems.length > 0) {
            menuItems.push({ type: 'submenu', label: 'Open with...', items: openWithItems });
        }
    }

    menuItems.push({ type: 'separator' });
    menuItems.push({ type: 'item', label: 'Cut', onClick: () => onCut(clickedItem) });
    menuItems.push({ type: 'item', label: 'Copy', onClick: () => onCopy(clickedItem) });
    menuItems.push({ type: 'separator' });
    menuItems.push({ type: 'item', label: 'Create shortcut', onClick: () => handleCreateShortcut(clickedItem, currentPath, refresh) });
    menuItems.push({ type: 'item', label: 'Delete', onClick: () => handleDeleteItem(clickedItem, refresh) });
    menuItems.push({ type: 'item', label: 'Rename', onClick: () => onRename(clickedItem) });
    menuItems.push({ type: 'separator' });
    menuItems.push({ type: 'item', label: 'Properties', onClick: () => handleShowProperties(clickedItem, openApp) });
    return menuItems;
  }
  else {
    const menuItems: ContextMenuItem[] = [];
    menuItems.push({ type: 'item', label: 'New Folder', onClick: () => handleNewFolder(currentPath, refresh) });
    menuItems.push({ type: 'item', label: 'New Text File', onClick: () => handleNewFile(currentPath, refresh) });
    menuItems.push({ type: 'separator' });
    menuItems.push({ type: 'item', label: 'Paste', onClick: () => onPaste(currentPath), disabled: isPasteDisabled });
    return menuItems;
  }
};
