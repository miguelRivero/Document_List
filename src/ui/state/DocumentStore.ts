import type { ListDocument } from '../../domain/Document';

type Listener = (docs: ListDocument[]) => void;

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

  addDocument(doc: ListDocument) {
  this.documents = [doc, ...this.documents.filter(d => d.id !== doc.id)];
    this.listeners.forEach(fn => fn(this.documents));
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }
}

export const documentStore = new DocumentStore();
