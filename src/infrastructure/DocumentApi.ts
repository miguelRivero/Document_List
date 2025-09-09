import type { ListDocument } from '../domain/Document';
import { mapApiDocumentToListDocument } from '../domain/DocumentMapper.js';

export class DocumentApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getRecentDocuments(): Promise<ListDocument[]> {
    const response = await fetch(`${this.baseUrl}/documents`);
    const data = await response.json();
    return data.map(mapApiDocumentToListDocument);
  }

  async getDocumentById(id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/documents`);
    const data = await response.json();
    const searchId = String(id).trim();
    const ids = data.map((doc: any) => String(doc.ID).trim());
    console.log('[DocumentApi] Buscando ID:', searchId, 'en', ids);
    const found = data.find((doc: any) => String(doc.ID).trim() === searchId);
    if (!found) {
      console.warn('[DocumentApi] Documento no encontrado para ID:', searchId);
    }
    return found ? mapApiDocumentToListDocument(found) : undefined;
  }
}
