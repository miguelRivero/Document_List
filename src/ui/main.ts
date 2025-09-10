import { AddDocumentModal, DocumentList, NotificationBanner } from './components/index.js';

import { DocumentApi } from '../infrastructure/DocumentApi.js';
import { DocumentWebSocket } from '../infrastructure/DocumentWebSocket.js';
import { ListDocument } from '../domain/Document.js';
import { documentStore } from './state/index.js';
import { sortSemver } from '../utils/sortSemver.js';

// Configure merge mode at app startup
documentStore.setMergeMode('merge'); // Keeps local documents (current behavior)
//documentStore.setMergeMode('replace'); // Only show latest documents

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

// Subscribe to store changes and re-render the list with the correct view mode
documentStore.subscribe(() => {
  renderDocuments();
});

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
  // Ensure view mode buttons reflect the current mode after any update
  const listViewBtn = document.getElementById('list-view-btn');
  const gridViewBtn = document.getElementById('grid-view-btn');
  if (listViewBtn && gridViewBtn) {
    if (viewMode === 'list') {
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
    } else {
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
    }
  }
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
          documentStore.addDocument(newDoc); // Use addDocument instead of manual merge
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
 * Trigger a fresh fetch from the API to get updated document list.
 */
ws.connect(async () => {
  try {
    // Get current documents count before fetching
    const currentDocsCount = documentStore.getDocuments().length;

    // Fetch fresh data from API
    const docs = await api.getRecentDocuments();

    // Handle based on merge mode
    if (documentStore.getMergeMode() === 'merge') {
      // Keep local documents, merge with API data (API docs first)
      const currentDocs = documentStore.getDocuments();
      const localDocs = currentDocs.filter(doc => !docs.some(apiDoc => apiDoc.id === doc.id));
      documentStore.setDocuments([...docs, ...localDocs]);
    } else {
      // Replace mode - just use API data
      documentStore.setDocuments(docs);
    }

    // Calculate how many new documents were added
    const newDocsCount = documentStore.getDocuments().length - currentDocsCount;

    // Show notification with the count of new documents
    if (newDocsCount > 0) {
      notificationBanner.show(newDocsCount);
    }
  } catch (error) {
    console.error('Error fetching documents after WebSocket notification:', error);
  }
});

// Initial load
loadDocuments();