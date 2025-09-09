import { CustomerDocument } from '../domain/Document';

type Listener = (docs: CustomerDocument[]) => void;

class DocumentStore {
  private documents: CustomerDocument[] = [];
  private listeners: Listener[] = [];

  getDocuments() {
    return this.documents;
  }


}

export const documentStore = new DocumentStore();
