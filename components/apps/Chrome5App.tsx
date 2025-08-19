import React, { useEffect } from 'react';
import { AppDefinition, AppComponentProps } from '../../types';
import { Browser5Icon } from '../../constants';

const Chrome5App: React.FC<AppComponentProps> = ({ onClose }) => {
    useEffect(() => {
        const url = `http://${window.location.hostname}:3000`;
        window.open(url, '_blank');
        // Close the app window after launching the tab
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    return (
        <div className="flex flex-col h-full bg-zinc-800 text-white items-center justify-center">
            <p>Launching Chrome 5 in a new tab...</p>
        </div>
    );
};

export const appDefinition: AppDefinition = {
  id: 'chrome5',
  name: 'Chrome 5',
  icon: Browser5Icon,
  component: Chrome5App,
  defaultSize: { width: 300, height: 200 },
};

export default Chrome5App;
