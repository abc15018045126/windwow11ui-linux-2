import React, { useEffect } from 'react';
import { AppDefinition, AppComponentProps, FilesystemItem } from '@kernel/types';
import Icon from '@kernel/components/icon';

const PropertiesApp: React.FC<AppComponentProps> = ({ setTitle, initialData }) => {
  const item = initialData?.item as FilesystemItem | undefined;

  useEffect(() => {
    if (item) {
      setTitle(`${item.name} Properties`);
    } else {
      setTitle('Properties');
    }
  }, [setTitle, item]);

  if (!item) {
    return <div className="p-4">No item selected.</div>;
  }

  let iconName = 'fileGeneric';
  if (item.type === 'folder') {
    iconName = 'folder';
  } else if (item.name.endsWith('.app') && item.content) {
      try {
          const appInfo = JSON.parse(item.content);
          if (appInfo.icon) iconName = appInfo.icon;
      } catch (e) {}
  }

  return (
    <div className="p-4 text-sm">
      <div className="flex items-center mb-4">
        <Icon iconName={iconName} className="w-8 h-8 mr-4" />
        <span className="font-bold text-lg">{item.name}</span>
      </div>
      <div className="space-y-2">
        <div className="flex">
          <span className="w-24 font-semibold">Type:</span>
          <span>{item.type === 'folder' ? 'Folder' : 'File'}</span>
        </div>
        <div className="flex">
          <span className="w-24 font-semibold">Path:</span>
          <span className="break-all">{item.path}</span>
        </div>
      </div>
    </div>
  );
};

export const appDefinition: AppDefinition = {
  id: 'properties',
  name: 'Properties',
  component: PropertiesApp,
  icon: 'fileGeneric',
  defaultSize: { width: 400, height: 250 },
};

export default PropertiesApp;
