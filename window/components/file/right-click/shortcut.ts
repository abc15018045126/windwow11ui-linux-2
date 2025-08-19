import { FilesystemItem } from '../../../types';
import * as FsService from '../../../../services/filesystemService';

export const handleCreateShortcut = async (item: FilesystemItem, currentPath: string, refresh: () => void) => {
  const shortcutName = await FsService.findUniqueName(currentPath, `${item.name} - Shortcut`, false, '.lnk.json');
  const shortcutContent = JSON.stringify({
    shortcutTo: item.path,
  });
  await FsService.createFile(currentPath, shortcutName, shortcutContent);
  refresh();
};
