var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DocumentApi } from './DocumentApi';
import { vi } from 'vitest';
import { mapApiDocumentToListDocument } from '../domain/DocumentMapper.js';
global.fetch = vi.fn();
describe('DocumentApi', () => {
    const baseUrl = 'http://localhost:8080';
    let api;
    beforeEach(() => {
        api = new DocumentApi(baseUrl);
        fetch.mockReset();
    });
    it('getRecentDocuments fetches and maps documents', () => __awaiter(void 0, void 0, void 0, function* () {
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
        fetch.mockResolvedValue({
            json: () => __awaiter(void 0, void 0, void 0, function* () { return apiDocs; }),
        });
        const result = yield api.getRecentDocuments();
        expect(fetch).toHaveBeenCalledWith(`${baseUrl}/documents`);
        expect(result).toEqual(apiDocs.map(mapApiDocumentToListDocument));
    }));
});
