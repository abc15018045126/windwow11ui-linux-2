import React from 'react';
import * as Icons from '@kernel/constants';
import { AppIconProps } from '@kernel/types';

const iconMap: Record<string, React.FC<AppIconProps>> = {
    start: Icons.StartIcon,
    search: Icons.SearchIcon,
    settings: Icons.SettingsIcon,
    about: Icons.AboutIcon,
    hyper: Icons.HyperIcon,
    fileExplorer: Icons.FileExplorerIcon,
    notebook: Icons.NotebookIcon,
    close: Icons.CloseIcon,
    minimize: Icons.MinimizeIcon,
    maximize: Icons.MaximizeIcon,
    restore: Icons.RestoreIcon,
    chrome: Icons.BrowserIcon,
    chrome2: Icons.Browser2Icon,
    chrome3: Icons.Browser3Icon,
    chrome4: Icons.Browser4Icon,
    sftp: Icons.SftpIcon,
    appStore: Icons.AppStoreIcon,
    refresh: Icons.RefreshIcon,
    theme: Icons.ThemeIcon,
    folder: Icons.FolderIcon,
    fileCode: Icons.FileCodeIcon,
    fileJson: Icons.FileJsonIcon,
    fileGeneric: Icons.FileGenericIcon,
    star: Icons.StarIcon,
    wifi: Icons.WifiIcon,
    sound: Icons.SoundIcon,
    battery: Icons.BatteryIcon,
    gemini: Icons.GeminiIcon,
    lightbulb: Icons.LightbulbIcon,
    user: Icons.UserIcon,
    copy: Icons.CopyIcon,
    check: Icons.CheckIcon,
    terminus: Icons.HyperIcon,
    terminusSsh: Icons.HyperIcon,
};

interface IconProps extends AppIconProps {
  iconName?: string;
}

export const Icon: React.FC<IconProps> = ({ iconName, ...rest }) => {
  if (!iconName) {
    return <Icons.FileGenericIcon {...rest} />;
  }
  const IconComponent = iconMap[iconName] || Icons.FileGenericIcon;
  return <IconComponent {...rest} />;
};

export default Icon;
