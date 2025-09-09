import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DocumentList } from '../../ui/components/DocumentList.js';
import { documentStore } from '../../ui/state/DocumentStore.js';

describe('Integration: WebSocket document updates', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    documentStore.setDocuments([]); // Reset store
  });

  afterEach(() => {
    container.remove();
    documentStore.setDocuments([]);
  });

  it('updates the document list when WebSocket notification arrives', async () => {
    // Mount DocumentList and subscribe to store
    const list = new DocumentList(container);
    documentStore.subscribe(docs => list.update(docs, 'list'));

    // Simulate WebSocket notification by adding a document to the store
    // This mimics what happens in DocumentWebSocket.handleMessage()
    const newDocument = {
      id: 'ws-doc-1',
      title: 'Doc A',
      version: '1',
      contributors: [{ id: 'ws-user-1', name: 'WebSocket User' }],
      attachments: [],
      createdAt: new Date().toISOString()
    };

    // Use addDocument like the WebSocket handler does
    documentStore.addDocument(newDocument);

    // Wait for DOM updates
    await Promise.resolve();

    // Check that the document appears in the list
    expect(container.textContent).toContain('Doc A');
    expect(container.textContent).toContain('WebSocket User');
  });

  it('preserves locally added documents when WebSocket updates arrive', async () => {
    // Mount DocumentList and subscribe to store
    const list = new DocumentList(container);
    documentStore.subscribe(docs => list.update(docs, 'list'));

    // Add a local document first
    const localDoc = {
      id: 'local-doc-1',
      title: 'Local Doc',
      version: '1',
      contributors: [{ id: 'local-user-1', name: 'Local User' }],
      attachments: [],
      createdAt: new Date().toISOString()
    };
    documentStore.addDocument(localDoc);

    // Simulate WebSocket notification
    const wsDoc = {
      id: 'ws-doc-1',
      title: 'WebSocket Doc',
      version: '1',
      contributors: [{ id: 'ws-user-2', name: 'WS User' }],
      attachments: [],
      createdAt: new Date().toISOString()
    };
    documentStore.addDocument(wsDoc);

    // Wait for DOM updates
    await Promise.resolve();

    // Both documents should be present
    expect(container.textContent).toContain('Local Doc');
    expect(container.textContent).toContain('WebSocket Doc');
  });
});