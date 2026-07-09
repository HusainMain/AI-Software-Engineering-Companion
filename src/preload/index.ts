import { contextBridge, ipcRenderer } from 'electron';
import type { ConversationReply } from '../main/conversation/types.js';

const companionApi = {
  sendMessage: (message: string): Promise<ConversationReply> =>
    ipcRenderer.invoke('conversation:send-message', message) as Promise<ConversationReply>,
};

contextBridge.exposeInMainWorld('companion', companionApi);

export type CompanionApi = typeof companionApi;
