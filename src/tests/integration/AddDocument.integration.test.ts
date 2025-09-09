import { beforeEach, describe, expect, it } from 'vitest';

import { AddDocumentModal } from '../../ui/components/AddDocumentModal.js';
import { DocumentList } from '../../ui/components/DocumentList.js';
import { NotificationBanner } from '../../ui/components/NotificationBanner.js';
import { documentStore } from '../../ui/state/DocumentStore.js';
import { fillAndSubmitForm } from '../../utils/fillAndSubmitForm.js';

describe('Integration: Add document - updates list and shows notification', () => {
  let container: HTMLElement;
  let notificationContainer: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    notificationContainer = document.createElement('div');
    document.body.appendChild(notificationContainer);
    documentStore.setDocuments([]); // Reset store
  });

  afterEach(() => {
    container.remove();
    notificationContainer.remove();
    documentStore.setDocuments([]);
  });

  it('creates a document, updates the list, and shows a notification', async () => {
    // Mount DocumentList and NotificationBanner
    new DocumentList(container);
    new NotificationBanner(notificationContainer);
    // Mount and open AddDocumentModal
    const modal = new AddDocumentModal((doc) => {
      documentStore.addDocument({ ...doc, id: 'test-id', createdAt: new Date().toISOString() });
    });
    modal.open();
    // Fill and submit the form
    fillAndSubmitForm(document.body, {
      title: 'Integration Doc',
      version: '1',
      contributors: ['Alice'],
      attachments: ['fileA.pdf']
    });
    // Wait for DOM updates
    await Promise.resolve();
    // Check that the document appears in the list
    expect(container.textContent).toContain('Integration Doc');
    // Check that the notification appears
    expect(notificationContainer.textContent).toContain('new document added');
  });
});
