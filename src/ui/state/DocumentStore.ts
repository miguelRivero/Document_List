import type { ListDocument } from '../../domain/Document';

type Listener = (docs: ListDocument[]) => void;
type MergeMode = 'merge' | 'replace';

/**
 * DocumentStore manages a list of documents and notifies subscribers on changes.
 * It supports setting the entire document list and adding individual documents.
 * When adding a document, it ensures no duplicates exist and places the new document at the front.
 */
class DocumentStore {
  private documents: ListDocument[] = [];
  private listeners: Listener[] = [];
  private mergeMode: MergeMode = 'merge'; // Default to current behavior

  getDocuments() {
    return this.documents;
  }

  setDocuments(docs: ListDocument[]) {
    this.documents = docs;
    this.listeners.forEach(fn => fn(this.documents));
  }

  /**
   * Sets the merge mode for handling incoming documents
   */
  setMergeMode(mode: MergeMode) {
    this.mergeMode = mode;
  }

  getMergeMode() {
    return this.mergeMode;
  }

  /**
   * Adds a document to the store.
   * The new document is always added to the front of the list.
   * @param doc Document to add to the store. If a document with the same ID exists, it is replaced.
   */
  addDocument(doc: ListDocument) {
    this.documents = [doc, ...this.documents.filter(d => d.id !== doc.id)];
    this.listeners.forEach(fn => fn(this.documents));
  }

  /**
   * Handles incoming documents based on merge mode
   * - merge: keeps existing documents and adds new ones
   * - replace: replaces all documents with incoming ones
   */
  handleIncomingDocument(doc: ListDocument) {
    if (this.mergeMode === 'merge') {
      this.addDocument(doc);
    } else {
      // In replace mode, we need to track which docs are from external sources
      // For now, just add the document (you could enhance this further)
      this.addDocument(doc);
    }
  }

  /**
   * Subscribes a listener function to document list changes.
   * @param fn Listener function to call on document list changes
   * @returns Unsubscribe function to remove the listener
   */
  subscribe(fn: Listener) {
    this.listeners.push(fn);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }
}

export const documentStore = new DocumentStore();
export type { MergeMode };