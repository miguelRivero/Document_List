var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { mapApiDocumentToListDocument } from '../domain/DocumentMapper.js';
export class DocumentApi {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    getRecentDocuments() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}/documents`);
            const data = yield response.json();
            return data.map(mapApiDocumentToListDocument);
        });
    }
    getDocumentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}/documents`);
            const data = yield response.json();
            const searchId = String(id).trim();
            const ids = data.map((doc) => String(doc.ID).trim());
            console.log('[DocumentApi] Buscando ID:', searchId, 'en', ids);
            const found = data.find((doc) => String(doc.ID).trim() === searchId);
            if (!found) {
                console.warn('[DocumentApi] Documento no encontrado para ID:', searchId);
            }
            return found ? mapApiDocumentToListDocument(found) : undefined;
        });
    }
}
