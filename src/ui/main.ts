import { AddDocumentModal, DocumentList, NotificationBanner } from './components/index.js';

import { DocumentApi } from '../infrastructure/DocumentApi.js';
import { DocumentWebSocket } from '../infrastructure/DocumentWebSocket.js';
import { ListDocument } from '../domain/Document.js';
import { documentStore } from './state/index.js';
import { sortSemver } from '../utils/sortSemver.js';

// State for view mode and sort
let viewMode: 'list' | 'grid' = 'list';
let sortBy: 'none' | 'name' | 'version' | 'createdAt' = 'none';

// Get references to DOM containers
const listContainer = document.getElementById('document-list')!;
const notificationContainer = document.getElementById('notification-banner')!;

// Instantiate services
const api = new DocumentApi('http://localhost:8080');
const ws = new DocumentWebSocket();

// Instantiate UI components
const documentList = new DocumentList(listContainer);
const notificationBanner = new NotificationBanner(notificationContainer);

let addDocumentModal: AddDocumentModal | null = null;

/**
 * Renders the document list based on current store state, view mode, and sort order.
 */
function renderDocuments() {
  let docs = documentStore.getDocuments();
  if (sortBy !== 'none') {
    docs = sortDocuments(docs, sortBy as 'name' | 'version' | 'createdAt');
  }
  documentList.update(docs, viewMode);
}

/**
 * Handle Add Document button click to open modal.
 */
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('add-document-btn')) {
    if (!addDocumentModal) {
      addDocumentModal = new AddDocumentModal(async (doc) => {
        try {
          const newDoc = createFrontendDocument(doc);
          // Lógica igual que la notificación: mergear y mantener orden
          const existing = documentStore.getDocuments();
          const docMap = new Map<string, ListDocument>([
            [newDoc.id, newDoc],
            ...existing.map(d => [d.id, d] as [string, ListDocument])
          ]);
          const merged: ListDocument[] = Array.from(docMap.values());
          documentStore.setDocuments(merged);
        } finally {
          addDocumentModal = null;
        }
      });
    }
    addDocumentModal.open();
  }
});

/**
 * Creates a frontend document object from the form data.
 * @param doc Document data from the form (without id, createdAt, attachments processed)
 * @returns A ListDocument object with the processed data.
 */
function createFrontendDocument(doc: Omit<ListDocument, 'id' | 'createdAt' | 'attachments'> & { attachments?: string | string[] }): ListDocument {
  const genId = () => (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

  const contributors = (doc.contributors || []).map(c => ({
    ...c,
    id: c.id || genId(),
  }));

  let attachments: string[] = [];
  if (typeof doc.attachments === 'string') {
    attachments = doc.attachments.split(',').map(s => s.trim()).filter(Boolean);
  } else if (Array.isArray(doc.attachments)) {
    attachments = doc.attachments;
  }

  return {
    ...doc,
    id: genId(),
    createdAt: new Date().toISOString(),
    contributors,
    attachments,
  } as ListDocument;
}

/**
 * Handle view mode toggle buttons and sort select
 */
const listViewBtn = document.getElementById('list-view-btn');
const gridViewBtn = document.getElementById('grid-view-btn');
const sortSelect = document.getElementById('sort-select') as HTMLSelectElement | null;

/**
 * Handle view mode toggle buttons
 */
if (listViewBtn && gridViewBtn) {
  listViewBtn.classList.add('active');
  gridViewBtn.classList.remove('active');

  listViewBtn.addEventListener('click', () => {
    viewMode = 'list';
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    renderDocuments();
  });
  gridViewBtn.addEventListener('click', () => {
    viewMode = 'grid';
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    renderDocuments();
  });
}
/**
 * Handle sort select change
 */
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    sortBy = (sortSelect.value || 'none') as 'none' | 'name' | 'version' | 'createdAt';
    renderDocuments();
  });
}
/**
 * Sorts an array of documents based on the specified criteria.
 * @param docs Array of documents to sort
 * @param by Criteria to sort by (name, version, createdAt)
 * @returns Sorted array of documents
 */
function sortDocuments(docs: ListDocument[], by: 'name' | 'version' | 'createdAt') {
  return [...docs].sort((a, b) => {
    if (by === 'name') {
      return a.title.localeCompare(b.title);
    }
    if (by === 'version') return sortSemver(a.version, b.version);
    if (by === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });
}

/**
 * Loads documents from the API and updates the store.
 */
async function loadDocuments() {
  const docs = await api.getRecentDocuments();
  documentStore.setDocuments(docs);
  renderDocuments();
}

/**
 * Handle incoming WebSocket messages for new documents.
 */
ws.connect(() => {
  api.getRecentDocuments().then(newDocs => {
    const existing = documentStore.getDocuments();
    // Documents that exist only locally (not in API response)
    const localOnly = existing.filter(doc => !newDocs.some(nd => nd.id === doc.id));
    // Merge: API docs (newest first), then local-only docs
    const merged = [...newDocs, ...localOnly];
    // Show notification only for truly new from API
    const existingIds = new Set(existing.map(doc => doc.id));
    const trulyNew = newDocs.filter(doc => !existingIds.has(doc.id));
    notificationBanner.show(trulyNew.length);
    if (trulyNew.length > 0) {
      console.log('[DocumentStore] New documents added:', trulyNew);
    }
    if (localOnly.length > 0) {
      console.log('[DocumentStore] Local-only documents kept:', localOnly);
    }
    console.log('[DocumentStore] Total documents:', merged.length);
    documentStore.setDocuments(merged);
  });
});


// Initial load
loadDocuments();
