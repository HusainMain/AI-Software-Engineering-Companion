import React, { FormEvent, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

interface Message {
  id: string;
  author: 'user' | 'assistant';
  content: string;
}

function App(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      author: 'assistant',
      content: 'Milestone 1 foundation is ready for a first conversation.',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('Idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const message = draft.trim();

    if (message.length === 0) {
      return;
    }

    setDraft('');
    setStatus('Processing');
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: crypto.randomUUID(), author: 'user', content: message },
    ]);

    try {
      const reply = await window.companion.sendMessage(message);
      setMessages((currentMessages) => [
        ...currentMessages,
        { id: crypto.randomUUID(), author: 'assistant', content: reply.response },
      ]);
      setStatus(`Saved decision ${reply.decision.id.slice(0, 8)}`);
    } catch {
      setStatus('Error');
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          author: 'assistant',
          content: 'The local runtime could not process that message.',
        },
      ]);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">AI</span>
          <span>Engineering Companion</span>
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
            <h1>Milestone 1 Shell</h1>
            <p>Local-first foundation runtime</p>
          </div>
          <span className="header-status">v0.1</span>
        </header>

        <section className="chat-area" aria-label="Conversation">
          {messages.map((message) => (
            <article key={message.id} className={`message ${message.author}`}>
              <span className="message-author">{message.author}</span>
              <p>{message.content}</p>
            </article>
          ))}
        </section>

        <form className="composer" onSubmit={(event) => void handleSubmit(event)}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Send a message"
            aria-label="Message"
          />
          <button type="submit">Send</button>
        </form>

        <footer className="status-bar">
          <span>{status}</span>
          <span>Electron + React + TypeScript</span>
        </footer>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
