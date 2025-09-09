import { DocumentApi } from './DocumentApi';

import { vi } from 'vitest';
import { mapApiDocumentToListDocument } from '../domain/DocumentMapper.js';

global.fetch = vi.fn();

describe('DocumentApi', () => {
  const baseUrl = 'http://localhost:8080';
  let api: DocumentApi;

  beforeEach(() => {
    api = new DocumentApi(baseUrl);
  (fetch as any).mockReset();
  });

  it('getRecentDocuments fetches and maps documents', async () => {
    const apiDocs = [
      {
        ID: '1',
        Title: 'Doc 1',
        Version: 'v1',
        CreatedAt: '2025-09-09T12:00:00Z',
        UpdatedAt: '2025-09-09T12:00:00Z',
        Contributors: [{ ID: 'c1', Name: 'Alice' }],
        Attachments: ['a.pdf'],
      },
    ];
  (fetch as any).mockResolvedValue({
      json: async () => apiDocs,
    });
    const result = await api.getRecentDocuments();
    expect(fetch).toHaveBeenCalledWith(`${baseUrl}/documents`);
    expect(result).toEqual(apiDocs.map(mapApiDocumentToListDocument));
  });
});
