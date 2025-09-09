var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AddDocumentModal, DocumentList, NotificationBanner } from './components/index.js';
import { DocumentApi } from '../infrastructure/DocumentApi.js';
import { DocumentWebSocket } from '../infrastructure/DocumentWebSocket.js';
import { compareSemver } from '../utils/semver.js';
import { documentStore } from './state/index.js';
// State for view mode and sort
let viewMode = 'list';
let sortBy = 'none';
function renderDocuments() {
    let docs = documentStore.getDocuments();
    if (sortBy !== 'none') {
        docs = sortDocuments(docs, sortBy);
    }
    documentList.update(docs, viewMode);
}
// Get references to DOM containers
const listContainer = document.getElementById('document-list');
const notificationContainer = document.getElementById('notification-banner');
// Instantiate services
const api = new DocumentApi('http://localhost:8080');
const ws = new DocumentWebSocket();
// Instantiate UI components
const documentList = new DocumentList(listContainer);
const notificationBanner = new NotificationBanner(notificationContainer);
let addDocumentModal = null;
document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('add-document-btn')) {
        if (!addDocumentModal) {
            addDocumentModal = new AddDocumentModal((doc) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const newDoc = createFrontendDocument(doc);
                    // Lógica igual que la notificación: mergear y mantener orden
                    const existing = documentStore.getDocuments();
                    const docMap = new Map([
                        [newDoc.id, newDoc],
                        ...existing.map(d => [d.id, d])
                    ]);
                    const merged = Array.from(docMap.values());
                    documentStore.setDocuments(merged);
                }
                finally {
                    addDocumentModal = null;
                }
            }));
        }
        addDocumentModal.open();
    }
});
function createFrontendDocument(doc) {
    const genId = () => (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    const contributors = (doc.contributors || []).map(c => (Object.assign(Object.assign({}, c), { id: c.id || genId() })));
    let attachments = [];
    if (typeof doc.attachments === 'string') {
        attachments = doc.attachments.split(',').map(s => s.trim()).filter(Boolean);
    }
    else if (Array.isArray(doc.attachments)) {
        attachments = doc.attachments;
    }
    return Object.assign(Object.assign({}, doc), { id: genId(), createdAt: new Date().toISOString(), contributors,
        attachments });
}
// View controls
const listViewBtn = document.getElementById('list-view-btn');
const gridViewBtn = document.getElementById('grid-view-btn');
const sortSelect = document.getElementById('sort-select');
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
        sortBy = (sortSelect.value || 'none');
        renderDocuments();
    });
}
let docs = documentStore.getDocuments();
if (sortBy !== 'none') {
    docs = sortDocuments(docs, sortBy);
}
documentList.update(docs, viewMode);
function sortDocuments(docs, by) {
    return [...docs].sort((a, b) => {
        if (by === 'name') {
            return a.title.localeCompare(b.title);
        }
        if (by === 'version')
            return compareSemver(a.version, b.version);
        if (by === 'createdAt')
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
    });
}
// Fetch and render documents
function loadDocuments() {
    return __awaiter(this, void 0, void 0, function* () {
        const docs = yield api.getRecentDocuments();
        documentStore.setDocuments(docs);
    });
}
// Listen for real-time notifications
ws.connect(() => {
    api.getRecentDocuments().then(newDocs => {
        const existing = documentStore.getDocuments();
        const docMap = new Map(existing.map(doc => [doc.id, doc]));
        let addedDoc = null;
        let newCount = 0;
        for (const doc of newDocs) {
            if (!docMap.has(doc.id)) {
                addedDoc = doc;
                newCount++;
            }
            docMap.set(doc.id, doc);
        }
        const merged = Array.from(docMap.values());
        notificationBanner.show(newCount);
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
