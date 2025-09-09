import type { ListDocument } from '../domain/Document';

export interface DocumentService {
  getRecentDocuments(): Promise<ListDocument[]>;
  createDocument(doc: Omit<ListDocument, 'id' | 'createdAt'>): Promise<ListDocument>;
  onDocumentCreated(callback: (doc: ListDocument) => void): void;
  sortDocuments(
    docs: ListDocument[],
    by: 'name' | 'version' | 'createdAt'
  ): ListDocument[];
}
