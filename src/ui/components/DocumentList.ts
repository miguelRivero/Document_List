import type { ListDocument } from '../../domain/Document';
import { formatRelativeTime } from '../../utils/formatRelativeTime.js';

export class DocumentList {
  constructor(private container: HTMLElement) { }

  update(documents: ListDocument[], viewMode: 'list' | 'grid' = 'list') {
    const documentsHtml = documents
      .map((doc) => this.renderDocument(doc, viewMode))
      .join('');

    if (viewMode === 'grid') {
      this.container.innerHTML = `
        <div class="document-list grid">${documentsHtml}</div>
        <div class="add-btn-row">
          <button class="add-document-btn sticky-add-btn" type="button">+ Add document</button>
        </div>
        `;
    } else {
      this.container.innerHTML = `
        <div class="document-list-headers">
          <div class="header-name">Name</div>
          <div>Contributors</div>
          <div>Attachments</div>
        </div>
        <div class="document-list list scrollable-list">${documentsHtml}</div>
        <button class="add-document-btn sticky-add-btn" type="button">+ Add document</button>
      `;
    }
  }

  private renderDocument(doc: ListDocument, viewMode: 'list' | 'grid'): string {
    const contributorNames = doc.contributors.map((c) => c.name).join(', ');
    const attachmentList = doc.attachments.join(', ');
    const relativeTime = formatRelativeTime(doc.createdAt);

    return `
      <div class="document-item">
        <div class="document-name">
          ${doc.title}
          <span>v${doc.version}</span>
          <small class="document-date">${relativeTime}</small>
        </div>
        <div class="document-contributors">${contributorNames}</div>
        <div class="document-attachments">${attachmentList}</div>
      </div>
    `;
  }
}