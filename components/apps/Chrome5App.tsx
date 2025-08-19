import React, { useEffect } from 'react';
import { AppDefinition, AppComponentProps } from '../../types';
import { Browser4Icon } from '../../constants';

const Chrome5App: React.FC<AppComponentProps> = ({ onClose }) => {
    useEffect(() => {
        // 1. Launch the backend process
        if (window.electronAPI) {
            window.electronAPI.launchExternal('components/apps/Chrome5');
        } else {
            console.error('electronAPI is not available. Cannot launch backend.');
            // Close the app window if we can't do anything
            if (onClose) onClose();
            return;
        }

        // 2. Open the frontend URL in an external browser tab
        // We add a small delay to give the backend server a moment to start.
        setTimeout(() => {
            const url = 'http://localhost:3000';
            window.open(url, '_blank');
        }, 1500); // 1.5-second delay

        // 3. Close this app window
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    // This component doesn't need to render anything meaningful
    // as it closes itself right after its effects run.
    return (
        <div className="flex flex-col h-full bg-zinc-800 text-white items-center justify-center">
            <p>Launching Chrome 5...</p>
        </div>
    );
};

export const appDefinition: AppDefinition = {
  id: 'chrome5',
  name: 'Chrome 5',
  icon: Browser4Icon, // Using an existing icon as per user feedback
  component: Chrome5App,
  defaultSize: { width: 300, height: 200 },
};

export default Chrome5App;
