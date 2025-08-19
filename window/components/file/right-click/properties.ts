import { FilesystemItem } from '@kernel/types';
import { DiscoveredAppDefinition } from '@kernel/contexts/AppContext';

type OpenAppFunction = (appIdentifier: string | DiscoveredAppDefinition, initialData?: any) => void;

export const handleShowProperties = (item: FilesystemItem, openApp: OpenAppFunction) => {
  openApp('properties', { item });
};
