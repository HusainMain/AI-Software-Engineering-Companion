import { contextBridge, ipcRenderer } from 'electron';

interface ConversationReply {
  result: {
    ok: boolean;
    response?: {
      recommendation: string;
      reasoning?: string;
      alternatives?: string[];
      tradeOffs?: string[];
      followUps?: string[];
      confidence?: number;
    };
    error?: {
      code: string;
      message: string;
      retryable: boolean;
      status?: number;
    };
  };
  decision: { id: string } | null;
}

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

  selectProject: (): Promise<string | null> => {
    return ipcRenderer.invoke('workspace:select-project') as Promise<string | null>;
  },

  getActiveProject: (): Promise<string | null> => {
    return ipcRenderer.invoke('workspace:get-active-project') as Promise<string | null>;
  },
};

contextBridge.exposeInMainWorld('companion', companionApi);

export type CompanionApi = typeof companionApi;