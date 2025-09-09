import type { ListDocument } from '../../domain/Document';

type Listener = (docs: ListDocument[]) => void;

/**
 * DocumentStore manages a list of documents and notifies subscribers on changes.
 * It supports setting the entire document list and adding individual documents.
 * When adding a document, it ensures no duplicates exist and places the new document at the front.
 */
class DocumentStore {
  private documents: ListDocument[] = [];
  private listeners: Listener[] = [];

  getDocuments() {
    return this.documents;
  }

  setDocuments(docs: ListDocument[]) {
    this.documents = docs;
    this.listeners.forEach(fn => fn(this.documents));
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
