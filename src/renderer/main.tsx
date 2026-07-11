import React, { FormEvent, useState, useRef, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import './styles.css';
import type { ProviderError, StructuredProviderResponse, ProviderCompletionResult, ProviderErrorCode } from '../main/ai/provider-types.js';
import type { CompanionApi } from '../preload/index.js';

declare global {
  interface Window {
    companion: CompanionApi;
  }
}

// Local types (matching workspace-core/types.ts and provider-types.ts)
interface DisplayableStructuredResponse {
  recommendation: string;
  reasoning: string;
  alternatives: string[];
  tradeOffs: string[];
  followUps: string[];
  confidence?: number;
}

type MessageResult = ProviderCompletionResult;

interface ConversationReply {
  result: MessageResult;
  decision: { id: string } | null;
}

interface Message {
  id: string;
  author: 'user' | 'assistant';
  content?: string;
  structuredResponse?: DisplayableStructuredResponse;
  error?: ProviderError;
  isLoading?: boolean;
}

const EXAMPLE_PROMPTS = [
  'Review my architecture',
  'What should I build next?',
  'Supabase vs Firebase',
  'How should I structure this project?',
];

const ERROR_MESSAGES: Record<string, { title: string; suggestion: string }> = {
  missing_configuration: {
    title: 'Missing Configuration',
    suggestion: 'Configure your AI provider in the settings file.',
  },
  invalid_api_key: {
    title: 'Invalid API Key',
    suggestion: 'Check that your API key is correct and has not expired.',
  },
  rate_limited: {
    title: 'Rate Limited',
    suggestion: 'Wait a moment before sending another request.',
  },
  provider_unavailable: {
    title: 'Provider Unavailable',
    suggestion: 'The AI service is temporarily unavailable. Try again later.',
  },
  timeout: {
    title: 'Request Timeout',
    suggestion: 'The request took too long. Check your connection and try again.',
  },
  malformed_response: {
    title: 'Malformed Response',
    suggestion: 'The AI returned an unexpected response format. Please try again.',
  },
  network_failure: {
    title: 'Network Error',
    suggestion: 'Check your internet connection and try again.',
  },
  unknown_error: {
    title: 'Unknown Error',
    suggestion: 'An unexpected error occurred. Please try again.',
  },
};

const PROGRESS_STEPS = [
  { key: 'preparing', label: 'Preparing project context...' },
  { key: 'selecting', label: 'Selecting relevant files...' },
  { key: 'building', label: 'Building prompt...' },
  { key: 'contacting', label: 'Contacting AI provider...' },
  { key: 'processing', label: 'Processing response...' },
  { key: 'rendering', label: 'Rendering response...' },
];

function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

function CodeBlockWithCopy({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    const codeElement = codeRef.current?.querySelector('code');
    if (!codeElement) return;

    const text = codeElement.textContent || '';
    copyToClipboard(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        // Silently fail - no global notification
      },
    );
  };

  const language = className?.replace('language-', '') || '';

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        {language && <span className="code-language">{language}</span>}
        <button
          type="button"
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre ref={codeRef} className={className}>
        {children}
      </pre>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }): React.JSX.Element {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
      components={{
        pre: ({ children, ...props }) => (
          <CodeBlockWithCopy {...props}>{children}</CodeBlockWithCopy>
        ),
        code: ({ children, ...props }) => {
          const isInline = !props.className;
          if (isInline) {
            return <code className="inline-code">{children}</code>;
          }
          return <code {...props}>{children}</code>;
        },
        table: ({ children, ...props }) => (
          <div className="markdown-table-wrapper">
            <table {...props}>{children}</table>
          </div>
        ),
        blockquote: ({ children, ...props }) => (
          <blockquote className="markdown-blockquote" {...props}>{children}</blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function CopyButton({
  text,
  label,
  ariaLabel,
}: {
  text: string;
  label: string;
  ariaLabel: string;
}): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        // Silently fail
      },
    );
  };

  return (
    <button
      type="button"
      className={`copy-section-button ${copied ? 'copied' : ''}`}
      onClick={handleCopy}
      aria-label={ariaLabel}
    >
      {copied ? 'Copied!' : label}
    </button>
  );
}

function StructuredResponseDisplay({
  response,
}: {
  response: DisplayableStructuredResponse;
}): React.JSX.Element {
  const fullResponse = [
    response.recommendation && `# Recommendation\n\n${response.recommendation}`,
    response.reasoning && `## Reasoning\n\n${response.reasoning}`,
    response.tradeOffs?.length && `## Trade-offs\n\n${response.tradeOffs.map((t) => `- ${t}`).join('\n')}`,
    response.alternatives?.length && `## Alternatives\n\n${response.alternatives.map((a) => `- ${a}`).join('\n')}`,
    response.followUps?.length && `## Follow-up Questions\n\n${response.followUps.map((f) => `- ${f}`).join('\n')}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  return (
    <div className="structured-response">
      <div className="structured-response-header">
        <h3>Response</h3>
        <div className="structured-response-actions">
          <CopyButton
            text={response.recommendation || ''}
            label="Copy Recommendation"
            ariaLabel="Copy recommendation to clipboard"
          />
          <CopyButton
            text={response.reasoning || ''}
            label="Copy Reasoning"
            ariaLabel="Copy reasoning to clipboard"
          />
          <CopyButton
            text={fullResponse}
            label="Copy Entire Response"
            ariaLabel="Copy entire response to clipboard"
          />
        </div>
      </div>
      {response.recommendation && (
        <section className="response-section">
          <h3>Recommendation</h3>
          <MarkdownRenderer content={response.recommendation} />
        </section>
      )}
      {response.reasoning && (
        <section className="response-section">
          <h3>Reasoning</h3>
          <MarkdownRenderer content={response.reasoning} />
        </section>
      )}
      {response.tradeOffs && response.tradeOffs.length > 0 && (
        <section className="response-section">
          <h3>Trade-offs</h3>
          <ul>
            {response.tradeOffs.map((item, idx) => (
              <li key={idx}><MarkdownRenderer content={item} /></li>
            ))}
          </ul>
        </section>
      )}
      {response.alternatives && response.alternatives.length > 0 && (
        <section className="response-section">
          <h3>Alternatives</h3>
          <ul>
            {response.alternatives.map((item, idx) => (
              <li key={idx}><MarkdownRenderer content={item} /></li>
            ))}
          </ul>
        </section>
      )}
      {response.followUps && response.followUps.length > 0 && (
        <section className="response-section">
          <h3>Follow-up Questions</h3>
          <ul>
            {response.followUps.map((item, idx) => (
              <li key={idx}><MarkdownRenderer content={item} /></li>
            ))}
          </ul>
        </section>
      )}
      {response.confidence !== undefined && (
        <section className="response-section confidence">
          <h3>Confidence</h3>
          <p>{(response.confidence * 100).toFixed(0)}%</p>
        </section>
      )}
    </div>
  );
}

function ErrorDisplay({
  error,
  onRetry,
}: {
  error: ProviderError;
  onRetry?: () => void;
}): React.JSX.Element {
  const errorInfo = ERROR_MESSAGES[error.code] || ERROR_MESSAGES.unknown_error;

  return (
    <div className="error-card" role="alert">
      <div className="error-icon" aria-hidden="true">!</div>
      <div className="error-content">
        <h3>{errorInfo.title}</h3>
        <p>{error.message}</p>
        <p className="error-suggestion">{errorInfo.suggestion}</p>
        {error.status && <p className="error-status">Status Code: {error.status}</p>}
        {onRetry && error.retryable && (
          <button
            type="button"
            className="error-retry-button"
            onClick={onRetry}
            aria-label="Retry request"
          >
            Retry
          </button>
        )}
        <button
          type="button"
          className="error-copy-button"
          onClick={() => void copyToClipboard(JSON.stringify(error, null, 2))}
          aria-label="Copy error details"
        >
          Copy Error Details
        </button>
      </div>
    </div>
  );
}

function ProgressIndicator({ currentStep }: { currentStep: number }): React.JSX.Element {
  return (
    <div className="progress-indicator" role="status" aria-live="polite" aria-label="Request progress">
      <div className="progress-steps">
        {PROGRESS_STEPS.map((step, idx) => (
          <div
            key={step.key}
            className={`progress-step ${idx < currentStep ? 'completed' : idx === currentStep ? 'current' : 'pending'}`}
          >
            <span className="progress-step-dot" aria-hidden="true">
              {idx < currentStep ? '✓' : idx + 1}
            </span>
            <span className="progress-step-label">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThinkingIndicator(): React.JSX.Element {
  return (
    <div className="thinking-indicator">
      <span className="thinking-dot"></span>
      <span className="thinking-dot"></span>
      <span className="thinking-dot"></span>
      <span className="thinking-text">Thinking</span>
    </div>
  );
}

function EmptyState({
  onPromptClick,
}: {
  onPromptClick: (prompt: string) => void;
}): React.JSX.Element {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">AI</div>
      <h1>AI Engineering Companion</h1>
      <p className="empty-state-description">
        Your local-first AI partner for software architecture, design decisions, and technical guidance.
      </p>
      <div className="example-prompts">
        <p className="example-prompts-label">Try asking:</p>
        <div className="example-prompts-grid">
          {EXAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="example-prompt"
              onClick={() => onPromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
}: {
  message: Message;
}): React.JSX.Element {
  if (message.isLoading) {
    return (
      <article className="message assistant loading" aria-live="polite">
        <div className="message-bubble">
          <ThinkingIndicator />
        </div>
      </article>
    );
  }

  return (
    <article className={`message ${message.author}`}>
      <div className="message-bubble">
        {message.content && <MarkdownRenderer content={message.content} />}
        {message.structuredResponse && <StructuredResponseDisplay response={message.structuredResponse} />}
        {message.error && <ErrorDisplay error={message.error} />}
      </div>
    </article>
  );
}

function ChatArea({
  messages,
  userHasScrolled,
  onPromptClick,
}: {
  messages: Message[];
  userHasScrolled: boolean;
  onPromptClick: (prompt: string) => void;
}): React.JSX.Element {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!userHasScrolled) {
      scrollToBottom();
    }
  }, [messages, userHasScrolled, scrollToBottom]);

  return (
    <section className="chat-area" aria-label="Conversation" aria-live="polite">
      {messages.length === 0 ? (
        <EmptyState onPromptClick={onPromptClick} />
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </section>
  );
}

function Composer({
  draft,
  setDraft,
  isProcessing,
  onSubmit,
  onCancel,
  textareaRef,
}: {
  draft: string;
  setDraft: (value: string) => void;
  isProcessing: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}): React.JSX.Element {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const sendKey = isMac ? event.metaKey : event.ctrlKey;

    if (event.key === 'Enter' && !event.shiftKey && !sendKey) {
      event.preventDefault();
      if (draft.trim() && !isProcessing) {
        onSubmit(event as unknown as FormEvent<HTMLFormElement>);
      }
    } else if ((event.key === 'Enter' && sendKey) || (event.key === 'Enter' && event.ctrlKey)) {
      event.preventDefault();
      if (draft.trim() && !isProcessing) {
        onSubmit(event as unknown as FormEvent<HTMLFormElement>);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(event.target.value);
    const textarea = event.target;
    textarea.style.height = 'auto';
    const maxHeight = 200;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  };

  return (
    <form className="composer" onSubmit={onSubmit}>
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Send a message"
        aria-label="Message"
        disabled={isProcessing}
        rows={1}
        className="composer-textarea"
      />
      <div className="composer-actions">
        <button type="submit" disabled={isProcessing || draft.trim().length === 0} className="composer-send">
          {isProcessing ? 'Sending...' : 'Send'}
        </button>
        {isProcessing && (
          <button
            type="button"
            className="composer-cancel"
            onClick={onCancel}
            aria-label="Cancel request"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function App(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('Ready');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    window.companion.getActiveProject().then(setActiveProject);
  }, []);

  const handleSelectProject = useCallback(async () => {
    setIsSelecting(true);
    try {
      const path = await window.companion.selectProject();
      if (path) {
        setActiveProject(path);
      }
    } finally {
      setIsSelecting(false);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!chatAreaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatAreaRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
    setUserHasScrolled(!isAtBottom);
  }, []);

  const startProgressAnimation = useCallback(() => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < PROGRESS_STEPS.length - 1) {
        step += 1;
        setProgressStep(step);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setMessages((currentMessages) => currentMessages.slice(0, -1));
    setIsProcessing(false);
    setStatus('Cancelled');
    setProgressStep(0);
  }, []);

  const handleRetry = useCallback(async () => {
    if (!lastUserMessage) return;
    await handleSubmit(new Event('submit') as unknown as FormEvent<HTMLFormElement>, lastUserMessage);
  }, [lastUserMessage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>, retryMessage?: string): Promise<void> {
    event.preventDefault();
    const message = retryMessage ?? draft.trim();

    if (message.length === 0 || isProcessing) {
      return;
    }

    if (!retryMessage) {
      setDraft('');
    }

    setLastUserMessage(message);
    setStatus(PROGRESS_STEPS[0].label);
    setIsProcessing(true);
    setProgressStep(0);

    const progressCleanup = startProgressAnimation();

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: crypto.randomUUID(), author: 'user', content: message },
      { id: crypto.randomUUID(), author: 'assistant', isLoading: true },
    ]);

    try {
      const reply: ConversationReply = await window.companion.sendMessage(message);

      console.log('[DEBUG] Renderer -> Received reply from IPC');
      console.log('[DEBUG] Renderer -> reply.result.ok:', reply.result.ok);
      if (!reply.result.ok) {
        console.log('[DEBUG] Renderer -> Error object:', JSON.stringify(reply.result.error, null, 2));
      }

      if (signal.aborted) {
        return;
      }

      progressCleanup();
      setProgressStep(PROGRESS_STEPS.length - 1);

      if (reply.result.ok) {
        const structuredResponse = mapToDisplayableStructuredResponse(reply.result.response!);
        setMessages((currentMessages) => [
          ...currentMessages.slice(0, -1),
          { id: crypto.randomUUID(), author: 'assistant', structuredResponse },
        ]);
        if (reply.decision) {
          setStatus(`Saved conversation ${reply.decision.id.slice(0, 8)}`);
        } else {
          setStatus('Saved');
        }
      } else {
        const error = reply.result.error;
        const retryHandler = error.retryable ? handleRetry : undefined;
        setMessages((currentMessages) => [
          ...currentMessages.slice(0, -1),
          { id: crypto.randomUUID(), author: 'assistant', error, onRetry: retryHandler },
        ]);
        setStatus('Error');
      }
    } catch (rawError) {
      if (signal.aborted) {
        return;
      }

      progressCleanup();
      console.error('[DEBUG] Renderer -> IPC communication error:', rawError);
      const error: ProviderError = {
        code: 'network_failure',
        message: 'An unexpected error occurred during communication with the AI companion.',
        retryable: true,
      };
      setMessages((currentMessages) => [
        ...currentMessages.slice(0, -1),
        { id: crypto.randomUUID(), author: 'assistant', error, onRetry: handleRetry },
      ]);
      setStatus('Error');
    } finally {
      if (!signal.aborted) {
        setIsProcessing(false);
        setProgressStep(0);
      }
    }
  }

  const handleExamplePromptClick = (prompt: string) => {
    setDraft(prompt);
    textareaRef.current?.focus();
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">AI</span>
          <span>Engineering Companion</span>
        </div>
        <div className="project-selector">
          {activeProject ? (
            <div className="project-info">
              <span className="project-label">Project:</span>
              <span className="project-name">{activeProject.split(/[/\\]/).pop()}</span>
              <button
                className="change-project-btn"
                onClick={handleSelectProject}
                disabled={isSelecting}
              >
                Change
              </button>
            </div>
          ) : (
            <button
              className="select-project-btn"
              onClick={handleSelectProject}
              disabled={isSelecting}
            >
              {isSelecting ? 'Selecting...' : 'Open Project'}
            </button>
          )}
        </div>
        <nav className="nav-list" aria-label="Workspace">
          <button type="button" className="nav-item active">
            Chat
          </button>
          <button type="button" className="nav-item">
            Project State
          </button>
          <button type="button" className="nav-item">
            Decisions
          </button>
        </nav>
      </aside>

      <section className="workspace">
        <header className="header">
          <div>
            <h1>AI Engineering Companion</h1>
            <p>Local-first AI partner for software engineering</p>
          </div>
          <span className="header-status">v0.1</span>
        </header>

        <div className="chat-container" ref={chatAreaRef} onScroll={handleScroll}>
          {isProcessing && (
            <div className="progress-overlay" role="status" aria-live="polite" aria-label="Request in progress">
              <ProgressIndicator currentStep={progressStep} />
            </div>
          )}
          <ChatArea
            messages={messages}
            userHasScrolled={userHasScrolled}
            onPromptClick={handleExamplePromptClick}
          />
        </div>

        <Composer
          draft={draft}
          setDraft={setDraft}
          isProcessing={isProcessing}
          onSubmit={(event) => void handleSubmit(event)}
          onCancel={handleCancel}
          textareaRef={textareaRef}
        />

        <footer className="status-bar">
          <span>{status}</span>
          <span>Electron + React + TypeScript</span>
        </footer>
      </section>
    </main>
  );
}

function mapToDisplayableStructuredResponse(response: StructuredProviderResponse): DisplayableStructuredResponse {
  return {
    recommendation: response.recommendation,
    reasoning: response.reasoning ?? 'No specific reasoning provided.',
    alternatives: response.alternatives,
    tradeOffs: response.tradeOffs,
    followUps: response.followUps ?? [],
    confidence: response.confidence,
  };
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);