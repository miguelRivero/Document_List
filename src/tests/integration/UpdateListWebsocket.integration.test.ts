import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DocumentList } from '../../ui/components/DocumentList.js';
import { DocumentWebSocket } from '../../infrastructure/DocumentWebSocket.js';
import { documentStore } from '../../ui/state/DocumentStore.js';

// Mock DocumentWebSocket to simulate a WebSocket event
vi.mock('../../infrastructure/DocumentWebSocket.js', () => {
  return {
    DocumentWebSocket: class {
      connect(cb: () => void) {
        // Simulate a WebSocket event after a tick
        setTimeout(() => {
          cb();
        }, 0);
      }
      disconnect() { }
    }
  };
});

describe('Integration: DocumentList updates on WebSocket notification', () => {
  let container: HTMLElement;
  let ws: DocumentWebSocket;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    documentStore.setDocuments([]); // Reset store
    ws = new DocumentWebSocket();
  });

  afterEach(() => {
    container.remove();
    documentStore.setDocuments([]);
    ws.disconnect();
  });

  it('updates the list when a WebSocket notification arrives', async () => {
    // Mount DocumentList
    new DocumentList(container);
    // Add initial document
    documentStore.setDocuments([
      {
        id: 'a',
        title: 'Doc A',
        version: '1',
        contributors: [{ id: 'c1', name: 'Alice' }],
        attachments: ['fileA.pdf'],
        createdAt: new Date().toISOString()
      }
    ]);
    expect(container.textContent).toContain('Doc A');

    // Simulate WebSocket notification: add a new document
    ws.connect(() => {
      documentStore.addDocument({
        id: 'b',
        title: 'Doc B',
        version: '2',
        contributors: [{ id: 'c2', name: 'Bob' }],
        attachments: ['fileB.pdf'],
        createdAt: new Date().toISOString()
      });
    });

    // Wait for the microtask and the setTimeout
    await new Promise(r => setTimeout(r, 10));
    expect(container.textContent).toContain('Doc B');
    expect(container.textContent).toContain('Doc A');
  });
});
