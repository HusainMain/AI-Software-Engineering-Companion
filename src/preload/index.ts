import { contextBridge, ipcRenderer } from 'electron';
import type { ConversationReply } from '../main/conversation/types.js';

const companionApi = {
  sendMessage: (message: string, signal?: AbortSignal): Promise<ConversationReply> => {
    console.log('[DEBUG] IPC Renderer -> Main: sendMessage called, message length:', message.length);
    const promise = ipcRenderer.invoke('conversation:send-message', message, signal) as Promise<ConversationReply>;
    promise.then(
      (result) => {
        console.log('[DEBUG] IPC Main -> Renderer: sendMessage resolved, result.ok:', result.result?.ok);
      },
      (error) => {
        console.log('[DEBUG] IPC Main -> Renderer: sendMessage rejected:', error);
      },
    );
    return promise;
  },

  cancelMessage: (): void => {
    ipcRenderer.send('conversation:cancel-message');
  },
};

contextBridge.exposeInMainWorld('companion', companionApi);

export type CompanionApi = typeof companionApi;