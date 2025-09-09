import { mapApiDocumentToListDocument } from './DocumentMapper.js';
describe('mapApiDocumentToListDocument', () => {
    it('maps all fields correctly from ApiDocument to ListDocument', () => {
        const apiDoc = {
            ID: '123',
            Title: 'Test Document',
            Version: 'v1',
            CreatedAt: '2025-09-09T12:00:00Z',
            UpdatedAt: '2025-09-09T12:00:00Z',
            Contributors: [
                { ID: 'u1', Name: 'Alice' },
                { ID: 'u2', Name: 'Bob' },
            ],
            Attachments: ['file1.pdf', 'file2.pdf'],
        };
        const expected = {
            id: '123',
            title: 'Test Document',
            contributors: [
                { id: 'u1', name: 'Alice' },
                { id: 'u2', name: 'Bob' },
            ],
            version: 'v1',
            attachments: ['file1.pdf', 'file2.pdf'],
            createdAt: '2025-09-09T12:00:00Z',
        };
        expect(mapApiDocumentToListDocument(apiDoc)).toEqual(expected);
    });
});
