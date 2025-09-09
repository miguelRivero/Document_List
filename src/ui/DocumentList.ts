import type { ListDocument } from '../domain/Document';
import { render } from '../utils/domHelpers';

export class DocumentList {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  update(documents: ListDocument[], view: 'list' | 'grid' = 'list') {
    const html = `
      <div class="document-list ${view}">
        ${documents.map(doc => `
          <div class="document-item">
            <div class="document-title">${doc.title}</div>
            <div class="document-version">v${doc.version}</div>
            <div class="document-contributors">
              Contributors: ${doc.contributors.map((c: { name: string }) => c.name).join(', ')}
            </div>
            <div class="document-attachments">
              Attachments: ${doc.attachments.length}
            </div>
            <div class="document-date">${new Date(doc.createdAt).toLocaleString()}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    render(this.container, html);
  }
}
