import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createConversationManager } from './conversation/conversation-manager.js';
import { createProviderManager } from './ai/provider-manager.js';
import { fetchJson } from './ai/provider-http.js';
import { createPromptBuilder } from './ai/prompt-builder.js';
import { createDecisionLog } from './decision-log/decision-log.js';
import { createRelevantFileSelector } from './relevant-file-selector/relevant-file-selector.js';
import { createProjectStateStore } from './project-state/project-state-store.js';
import { createProjectScanner } from './project-scanner/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.VITE_DEV_SERVER_URL !== undefined || !app.isPackaged;
const projectRoot = app.getAppPath();
const dataRoot = app.isPackaged ? app.getPath('userData') : projectRoot;

const projectStateStore = createProjectStateStore(dataRoot);
const decisionLog = createDecisionLog(dataRoot);
const relevantFileSelector = createRelevantFileSelector(projectRoot);
const promptBuilder = createPromptBuilder();
const providerManager = createProviderManager({}, { transport: fetchJson });
const projectScanner = createProjectScanner({ rootPath: projectRoot });
const conversationManager = createConversationManager({
  projectStateStore,
  relevantFileSelector,
  promptBuilder,
  providerManager,
  decisionLog,
  projectScanner,
});

// Scan project on startup
void projectScanner.scan().then(async (result) => {
  console.log('[DEBUG] Project scan completed:', {
    projectName: result.context.projectName,
    totalFiles: result.context.totalFiles,
    technologies: result.context.technologies.map(t => t.name),
    languages: result.context.languages.map(l => l.name),
    importantFiles: result.context.importantFiles.length,
    durationMs: result.context.scanDurationMs,
  });
  if (result.errors.length > 0) {
    console.warn('[DEBUG] Project scan errors:', result.errors);
  }
  await projectStateStore.update({
    projectContext: result.context,
  });
});

let currentAbortController: AbortController | null = null;

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 900,
    minHeight: 620,
    title: 'AI Software Engineering Companion',
    backgroundColor: '#f6f7f9',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev) {
    void window.loadURL('http://127.0.0.1:5173');
    window.webContents.openDevTools({ mode: 'detach' });
    return;
  }

  void window.loadFile(path.join(__dirname, '../../dist/index.html'));
}

void app.whenReady().then(() => {
  ipcMain.handle('conversation:send-message', async (_event, message: string, signal?: AbortSignal) => {
    if (typeof message !== 'string') {
      throw new TypeError('Conversation message must be a string.');
    }

    currentAbortController = new AbortController();
    const abortSignal = currentAbortController.signal;

    // If an external signal is provided (from renderer), listen for it
    if (signal) {
      signal.addEventListener('abort', () => {
        currentAbortController?.abort();
      });
    }

    try {
      const result = await conversationManager.handleUserMessage(message, abortSignal);
      return result;
    } finally {
      currentAbortController = null;
    }
  });

  ipcMain.on('conversation:cancel-message', () => {
    currentAbortController?.abort();
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
