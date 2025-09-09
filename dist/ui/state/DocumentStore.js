class DocumentStore {
    constructor() {
        this.documents = [];
        this.listeners = [];
    }
    getDocuments() {
        return this.documents;
    }
    setDocuments(docs) {
        this.documents = docs;
        this.listeners.forEach(fn => fn(this.documents));
    }
    addDocument(doc) {
        this.documents = [doc, ...this.documents.filter(d => d.id !== doc.id)];
        this.listeners.forEach(fn => fn(this.documents));
    }
    subscribe(fn) {
        this.listeners.push(fn);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }
}
export const documentStore = new DocumentStore();
