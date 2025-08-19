import { FilesystemItem } from '../../types';
import { ContextMenuItem } from '../ContextMenu';
import { DiscoveredAppDefinition } from '../../contexts/AppContext';

type OpenAppFunction = (appIdentifier: string | DiscoveredAppDefinition, initialData?: any) => void;

export const getOpenWithMenuItems = (
    apps: DiscoveredAppDefinition[],
    item: FilesystemItem,
    openApp: OpenAppFunction
): ContextMenuItem[] => {

    const fileHandlers = apps.filter(app => app.handlesFiles);

    if (fileHandlers.length === 0) {
        return [];
    }

    const openWithItems: ContextMenuItem[] = fileHandlers.map(app => ({
        type: 'item',
        label: app.name,
        onClick: () => openApp(app, { file: item }),
    }));

    return openWithItems;
};
