import type { ApiDocument, ListDocument } from './Document';

export function mapApiDocumentToListDocument(apiDoc: ApiDocument): ListDocument {
  return {
    id: apiDoc.ID,
    title: apiDoc.Title,
    contributors: apiDoc.Contributors.map(c => ({ id: c.ID, name: c.Name })),
    version: apiDoc.Version,
    attachments: apiDoc.Attachments,
    createdAt: apiDoc.CreatedAt,
  };
}
