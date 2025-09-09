class DocumentStore {
    constructor() {
        this.documents = [];
        this.listeners = [];
    }
    getDocuments() {
        return this.documents;
    }
}
export const documentStore = new DocumentStore();
