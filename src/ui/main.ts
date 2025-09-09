import { AddDocumentModal, DocumentList, NotificationBanner } from './components/index.js';

import { DocumentApi } from '../infrastructure/DocumentApi.js';
import { DocumentWebSocket } from '../infrastructure/DocumentWebSocket.js';
import { ListDocument } from '../domain/Document.js';
import { compareSemver } from '../utils/semver.js';
import { documentStore } from './state/index.js';

// State for view mode and sort
let viewMode: 'list' | 'grid' = 'list';
let sortBy: 'none' | 'name' | 'version' | 'createdAt' = 'none';

function renderDocuments() {
  let docs = documentStore.getDocuments();
  if (sortBy !== 'none') {
    docs = sortDocuments(docs, sortBy as 'name' | 'version' | 'createdAt');
  }
  documentList.update(docs, viewMode);
}

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

// View controls
const listViewBtn = document.getElementById('list-view-btn');
const gridViewBtn = document.getElementById('grid-view-btn');
const sortSelect = document.getElementById('sort-select') as HTMLSelectElement | null;

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

if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    sortBy = (sortSelect.value || 'none') as 'none' | 'name' | 'version' | 'createdAt';
    renderDocuments();
  });
}

  let docs = documentStore.getDocuments();
  if (sortBy !== 'none') {
    docs = sortDocuments(docs, sortBy as 'name' | 'version' | 'createdAt');
  }
  documentList.update(docs, viewMode);
}


function sortDocuments(docs: ListDocument[], by: 'name' | 'version' | 'createdAt') {
  return [...docs].sort((a, b) => {
    if (by === 'name') {
      return a.title.localeCompare(b.title);
    }
    if (by === 'version') return compareSemver(a.version, b.version);
    if (by === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });
}

// Fetch and render documents
async function loadDocuments() {
  const docs = await api.getRecentDocuments();
  documentStore.setDocuments(docs);
}

// Listen for real-time notifications
ws.connect(() => {
  notificationBanner.show();
  // Only react to the event, ignore the notification content
  api.getRecentDocuments().then(newDocs => {
    const existing = documentStore.getDocuments();
    const docMap = new Map(existing.map(doc => [doc.id, doc]));
    let addedDoc: ListDocument | null = null;
    for (const doc of newDocs) {
      if (!docMap.has(doc.id)) {
        addedDoc = doc;
      }
      docMap.set(doc.id, doc);
    }
    const merged = Array.from(docMap.values());
    if (addedDoc) {
      console.log('[DocumentStore] New document added:', addedDoc);
    }
    console.log('[DocumentStore] Total documents:', merged.length);
    documentStore.setDocuments(merged);
  });
});

// Subscribe UI to store changes
documentStore.subscribe(() => {
  renderDocuments();
});

// Initial load
loadDocuments();
