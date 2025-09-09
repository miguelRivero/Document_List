import { describe, it, expect, beforeEach } from 'vitest';
import { documentStore } from './DocumentStore';
import type { ListDocument } from '../../domain/Document';

describe('DocumentStore', () => {
  let docA: ListDocument;
  let docB: ListDocument;

  beforeEach(() => {
    // Reset store state before each test
    documentStore.setDocuments([]);
    docA = {
      id: 'a',
      title: 'Doc A',
      version: '1',
      contributors: [{ id: 'c1', name: 'Alice' }],
      attachments: ['fileA.pdf'],
      createdAt: new Date().toISOString()
    };
    docB = {
      id: 'b',
      title: 'Doc B',
      version: '1',
      contributors: [{ id: 'c2', name: 'Bob' }],
      attachments: ['fileB.pdf'],
      createdAt: new Date().toISOString()
    };
  });

  it('starts with an empty document list', () => {
    expect(documentStore.getDocuments()).toEqual([]);
  });

  it('sets documents and notifies listeners', () => {
    let notified: ListDocument[] = [];
    const unsubscribe = documentStore.subscribe(docs => { notified = docs; });
    documentStore.setDocuments([docA, docB]);
    expect(documentStore.getDocuments()).toEqual([docA, docB]);
    expect(notified).toEqual([docA, docB]);
    unsubscribe();
  });

  it('adds a document to the beginning and removes duplicates', () => {
    documentStore.setDocuments([docA]);
    documentStore.addDocument(docB);
    expect(documentStore.getDocuments()).toEqual([docB, docA]);
    // Add docA again, should move to front and not duplicate
    documentStore.addDocument(docA);
    expect(documentStore.getDocuments()).toEqual([docA, docB]);
  });

  it('notifies all listeners on setDocuments and addDocument', () => {
    let calls: ListDocument[][] = [];
    const unsubscribe = documentStore.subscribe(docs => { calls.push([...docs]); });
    documentStore.setDocuments([docA]);
    documentStore.addDocument(docB);
    expect(calls).toEqual([[docA], [docB, docA]]);
    unsubscribe();
  });

  it('unsubscribe removes the listener', () => {
    let called = false;
    const unsubscribe = documentStore.subscribe(() => { called = true; });
    unsubscribe();
    documentStore.setDocuments([docA]);
    expect(called).toBe(false);
  });
});
