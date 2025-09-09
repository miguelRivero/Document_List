import { describe, it, expect, beforeEach } from 'vitest';
import { DocumentList } from './DocumentList';
import type { ListDocument } from '../../domain/Document';

describe('DocumentList', () => {
  let container: HTMLElement;
  let component: DocumentList;

  const docs: ListDocument[] = [
    {
      id: '1',
      title: 'Doc 1',
      version: '1.0.0',
      contributors: [
        { id: 'a', name: 'Alice' },
        { id: 'b', name: 'Bob' }
      ],
      attachments: ['file1.pdf', 'file2.docx'],
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Doc 2',
      version: '2.0.0',
      contributors: [
        { id: 'c', name: 'Carol' },
        { id: 'd', name: 'Dave' }
      ],
      attachments: ['file3.png', 'file4.xls'],
      createdAt: '2023-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'document-list';
    document.body.appendChild(container);
    component = new DocumentList(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('renders documents in list view with correct content', () => {
    component.update(docs, 'list');
    expect(container.querySelectorAll('.document-item').length).toBe(2);
    expect(container.innerHTML).toContain('Doc 1');
    expect(container.innerHTML).toContain('Doc 2');
    expect(container.innerHTML).toContain('Alice');
    expect(container.innerHTML).toContain('file1.pdf');
    expect(container.innerHTML).toContain('Bob');
    expect(container.innerHTML).toContain('Carol');
    expect(container.innerHTML).toContain('Dave');
    expect(container.innerHTML).toContain('file2.docx');
    expect(container.innerHTML).toContain('file3.png');
    expect(container.innerHTML).toContain('file4.xls');
    expect(container.querySelector('.document-list-headers')).not.toBeNull();
    expect(container.querySelector('.add-document-btn')).not.toBeNull();

  });

  it('renders documents in grid view without headers', () => {
    component.update(docs, 'grid');
    expect(container.querySelectorAll('.document-item').length).toBe(2);
    expect(container.querySelector('.document-list-headers')).toBeNull();
    expect(container.innerHTML).toContain('Doc 1');
    expect(container.innerHTML).toContain('Doc 2');
    expect(container.querySelector('.add-document-btn')).not.toBeNull();
  });
});
