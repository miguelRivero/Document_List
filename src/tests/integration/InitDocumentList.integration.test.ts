import { beforeEach, describe, expect, it } from 'vitest';

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

  it('renders documents from the store and updates on add', () => {
    // Mount DocumentList
    new DocumentList(container);
    // Initially empty
    expect(container.textContent).not.toContain('Doc A');
    // Add a document to the store
    documentStore.addDocument({
      id: 'a',
      title: 'Doc A',
      version: '1',
      contributors: [{ id: 'c1', name: 'Alice' }],
      attachments: ['fileA.pdf'],
      createdAt: new Date().toISOString()
    });
    // Wait for the DOM to update (next microtask)
    return Promise.resolve().then(() => {
      expect(container.textContent).toContain('Doc A');
    });
  });
});
