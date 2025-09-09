import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DocumentList } from '../../ui/components/DocumentList.js';
import { documentStore } from '../../ui/state/DocumentStore.js';

describe('Integration: DocumentList + DocumentStore', () => {
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

  it('renders documents from the store and updates on add', async () => {
    // Create initial documents
    const initialDocs = [
      {
        id: 'doc-1',
        title: 'Doc A',
        version: '1',
        contributors: [{ id: 'user-1', name: 'Alice' }],
        attachments: ['file1.pdf'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'doc-2',
        title: 'Doc B',
        version: '2',
        contributors: [{ id: 'user-2', name: 'Bob' }],
        attachments: [],
        createdAt: new Date().toISOString()
      }
    ];

    // Set initial documents in store
    documentStore.setDocuments(initialDocs);

    // Mount DocumentList and subscribe to store changes
    const list = new DocumentList(container);
    documentStore.subscribe(docs => list.update(docs, 'list'));

    // Trigger initial render with current documents
    list.update(documentStore.getDocuments(), 'list');

    // Wait for DOM updates
    await Promise.resolve();

    // Check initial documents are rendered
    expect(container.textContent).toContain('Doc A');
    expect(container.textContent).toContain('Doc B');
    expect(container.textContent).toContain('Alice');
    expect(container.textContent).toContain('Bob');

    // Add a new document
    const newDoc = {
      id: 'doc-3',
      title: 'Doc C',
      version: '1',
      contributors: [{ id: 'user-3', name: 'Charlie' }],
      attachments: ['file2.pdf'],
      createdAt: new Date().toISOString()
    };

    documentStore.addDocument(newDoc);

    // Wait for DOM updates
    await Promise.resolve();

    // Check that all three documents are now rendered
    expect(container.textContent).toContain('Doc A');
    expect(container.textContent).toContain('Doc B');
    expect(container.textContent).toContain('Doc C');
    expect(container.textContent).toContain('Charlie');
  });
});