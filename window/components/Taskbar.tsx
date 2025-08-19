import React, { useState, useEffect, useContext, useMemo } from 'react';
import { OpenApp } from '../../types';
import { DiscoveredAppDefinition, AppContext } from '../../components/AppContext';
import { APP_DEFINITIONS } from '../../components/apps';
import { StartIcon, TASKBAR_HEIGHT, FileGenericIcon } from '../../constants';
import { useTheme } from '../../components/theme';

interface TaskbarProps {
  openApps: OpenApp[];
  activeAppInstanceId: string | null;
  onToggleStartMenu: () => void;
  onAppIconClick: (app: DiscoveredAppDefinition, instanceId?: string) => void;
}

const getIconComponent = (iconId?: string) => {
    if (iconId) {
        const appDef = APP_DEFINITIONS.find(def => def.id === iconId);
        if (appDef) return appDef.icon;
    }
    return FileGenericIcon;
};

const Taskbar: React.FC<TaskbarProps> = ({ openApps, activeAppInstanceId, onToggleStartMenu, onAppIconClick }) => {
  const { apps: discoveredApps } = useContext(AppContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme } = useTheme();

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const taskbarItems = useMemo(() => {
    const items = new Map<string, { appDef: DiscoveredAppDefinition, instance?: OpenApp }>();

    // Add pinned apps first
    const pinnedApps = discoveredApps.filter(app => app.isPinned);
    pinnedApps.forEach(appDef => {
      items.set(appDef.appId || appDef.path!, { appDef });
    });

    // Add or update with open apps
    openApps.forEach(openApp => {
      const key = openApp.id; // This is the appId from the original static definition
      const appDef = discoveredApps.find(app => app.appId === key);
      if (appDef) {
        items.set(key, { appDef, instance: openApp });
      }
    });

    return Array.from(items.values());
  }, [discoveredApps, openApps]);


  return (
    <div
      className={`flex items-center justify-between px-4 fixed bottom-0 left-0 right-0 z-50 ${theme.taskbar.background} ${theme.taskbar.textColor}`}
      style={{ height: `${TASKBAR_HEIGHT}px` }}
    >
      {/* Centered Icons */}
      <div className="flex-1 flex justify-center items-center h-full">
        <div className="flex items-center space-x-2 h-full">
          <button
            onClick={onToggleStartMenu}
            className={`taskbar-start-button p-2 rounded h-full flex items-center ${theme.taskbar.buttonHover}`}
            aria-label="Start Menu"
          >
            <StartIcon className="w-5 h-5 text-blue-400" />
          </button>

          {taskbarItems.map(({ appDef, instance }) => {
            const isActive = instance?.instanceId === activeAppInstanceId && !instance?.isMinimized;
            const isMinimized = instance?.isMinimized;
            const isOpen = !!instance;
            const IconComponent = getIconComponent(appDef.icon);

            return (
              <button
                key={appDef.id}
                onClick={() => onAppIconClick(appDef, instance?.instanceId)}
                className={`p-2 rounded h-[calc(100%-8px)] flex items-center relative transition-colors duration-150 ease-in-out
                            ${isActive ? theme.taskbar.activeButton : theme.taskbar.buttonHover}
                            ${isMinimized ? 'opacity-70' : ''}`}
                title={appDef.name}
              >
                <IconComponent className="w-5 h-5" isSmall />
                {isOpen && (
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-1 rounded-t-sm 
                                  ${isActive ? theme.taskbar.activeIndicator : isMinimized ? 'bg-gray-400' : 'bg-gray-500'}`}></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* System Tray - right aligned */}
      <div className="flex items-center space-x-3 text-xs">
        <div>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div>{currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
      </div>
    </div>
  );
};

export default Taskbar;
