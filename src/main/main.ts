import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createWorkspaceCore } from './workspace-core/index.js'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isDev = process.env.VITE_DEV_SERVER_URL !== undefined || !app.isPackaged
const dataRoot = app.isPackaged ? app.getPath('userData') : path.dirname(__dirname)

let workspaceCore: Awaited<ReturnType<typeof createWorkspaceCore>>

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
  })

  if (isDev) {
    void window.loadURL('http://127.0.0.1:5173')
    window.webContents.openDevTools({ mode: 'detach' })
    return
  }

  void window.loadFile(path.join(__dirname, '../../dist/index.html'))
}

void app.whenReady().then(async () => {
  workspaceCore = await createWorkspaceCore({ dataRoot })
  await workspaceCore.start()

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', async () => {
  await workspaceCore.stop()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})