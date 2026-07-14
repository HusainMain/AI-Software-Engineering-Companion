import { describe, it, expect } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createWorkspaceCore } from './workspace-core.js';

/** Helper to create a tiny dummy project */
async function createTempProject(): Promise<{ root: string; dataRoot: string }> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'proj-'));
  const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'data-'));
  // Minimal package.json and a source file
  await fs.writeFile(path.join(root, 'package.json'), JSON.stringify({ name: 'temp', version: '0.0.0' }));
  await fs.mkdir(path.join(root, 'src'), { recursive: true });
  await fs.writeFile(path.join(root, 'src', 'index.ts'), 'export const foo = 1;');
  return { root, dataRoot };
}

describe('End‑to‑end workspace integration', () => {
  it('opens a project, sends a message and records a decision', async () => {
    const { root, dataRoot } = await createTempProject();
    const workspace = await createWorkspaceCore({ dataRoot });
    // Open the temp project
    await (workspace as any).openProject(root);

    // Send a simple user question
    const reply = await (workspace as any).sendMessage('How should I add a new dependency?');
    expect(reply.result.ok).toBe(true);
    expect(reply.decision).toBeDefined();
    expect(reply.decision?.id).toBeDefined();
    // The conversation should now be persisted – we can verify by re‑loading the memory DB
    const { createEngineeringMemory } = await import('../engineering-memory/index.js');
    const memory = await createEngineeringMemory(path.join(dataRoot, 'engineering-memory.db'));
    const conversations = await (memory as any).listConversations?.(); // Using internal method if exists
    // At least one conversation entry should exist
    expect(Array.isArray(conversations)).toBe(true);
    expect(conversations?.length).toBeGreaterThan(0);
    await workspace.stop();
  }, 15000);
});
