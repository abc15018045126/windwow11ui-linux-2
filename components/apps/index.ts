import type { AppDefinition } from '@kernel/types';

import { appDefinition as aboutAppDefinition } from '@apps/About/About';
import { appDefinition as fileExplorerAppDefinition } from '../../window/components/FileExplorer/FileExplorer';
import { appDefinition as geminiChatAppDefinition } from '@apps/GeminiChat/GeminiChat';
import { appDefinition as hyperAppDefinition } from '@apps/Hyper/Hyper';
import { appDefinition as notebookAppDefinition } from '../../window/components/apps/Notebook/Notebook';
import { appDefinition as settingsAppDefinition } from '../../window/components/Settings/Settings';
import { appDefinition as chromeAppDefinition } from '@apps/Chrome/Chrome';
import { appDefinition as chrome2AppDefinition } from '@apps/Chrome2/Chrome2';
import { appDefinition as chrome3AppDefinition } from '@apps/Chrome3/Chrome3';
import { appDefinition as chrome4AppDefinition } from '@apps/Chrome4/Chrome4';
import { appDefinition as terminusAppDefinition } from '@apps/Terminus/Terminus';
import { appDefinition as terminusSshAppDefinition } from '../../window/components/apps/TerminusSsh/TerminusSsh';
import { appDefinition as sftpAppDefinition } from '../../window/components/apps/SFTP/SFTP';
import { appDefinition as appStoreAppDefinition } from '../../window/components/AppStore/AppStore';
import { appDefinition as themeAppDefinition } from '@apps/Theme/Theme';
import { appDefinition as propertiesAppDefinition } from '@apps/Properties/Properties';

/**
 * The master list of all applications available in the OS.
 * To add a new app:
 * 1. Create your app component in a new file under this `apps` directory.
 * 2. In that file, export an `appDefinition` object of type `AppDefinition`.
 * 3. Import that definition here and add it to this array.
 */
export const APP_DEFINITIONS: AppDefinition[] = [
  appStoreAppDefinition,
  themeAppDefinition,
  sftpAppDefinition,
  terminusAppDefinition, // New simplified local terminal
  terminusSshAppDefinition, // The original multi-host terminal
  chromeAppDefinition,
  chrome2AppDefinition,
  chrome3AppDefinition, // Restored Chrome 3
  chrome4AppDefinition,
  fileExplorerAppDefinition,
  geminiChatAppDefinition,
  hyperAppDefinition,
  settingsAppDefinition,
  notebookAppDefinition,
  aboutAppDefinition,
  propertiesAppDefinition,
];