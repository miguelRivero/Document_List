
import type { ListDocument } from '../../domain/Document';

import { documentStore } from '../state/DocumentStore.js';
import type { Contributor } from '../../domain/Document';

/** Component to display a list of documents in either list or grid view.
 */
export class DocumentList {
  private listContainer: HTMLElement;

  private unsubscribe: (() => void) | null = null;

  constructor(listContainer: HTMLElement) {
    this.listContainer = listContainer;
    // Subscribe to store changes and update automatically
    this.unsubscribe = documentStore.subscribe((docs) => {
      this.update(docs);
    });
    // Initial render
    this.update(documentStore.getDocuments());
  }

  destroy() {
    if (this.unsubscribe) this.unsubscribe();
  }

  /**
   * 
   * @param documents Array of documents to display
   * @param view 
   */
  update(documents: ListDocument[], view: 'list' | 'grid' = 'list') {
    let html = '';
    if (view === 'list') {
      html = `
        <div class="document-list-headers">
          <div class="header-name">Name</div>
          <div class="header-contributors">Contributors</div>
          <div class="header-attachments">Attachments</div>
        </div>
        <div class="document-list list scrollable-list">
          ${documents.map(doc => `
            <div class="document-item">
              <div class="document-name">${doc.title}<br><span>v${doc.version}</span></div>
              <div class="document-contributors">
                  ${doc.contributors.map((c: Contributor) => c.name).join('<br>') || 'No contributors'}
              </div>
              <div class="document-attachments">
                ${Array.isArray(doc.attachments) && doc.attachments.length > 0 ? doc.attachments.join('<br>') : 'No attachments'}
              </div>
            </div>
          `).join('')}
        </div>
        <button class="add-document-btn sticky-add-btn" type="button">+ Add document</button>
      `;
    } else {
      html = `
        <div class="document-list grid scrollable-list">
          ${documents.map(doc => `
            <div class="document-item">
              <div class="document-name">${doc.title}<br><span>v${doc.version}</span></div>
              <div class="document-contributors">
                  ${doc.contributors.map((c: Contributor) => c.name).join('<br>') || 'No contributors'}
              </div>
              <div class="document-attachments">
                ${Array.isArray(doc.attachments) && doc.attachments.length > 0 ? doc.attachments.join('<br>') : 'No attachments'}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="add-btn-row">
          <button class="add-document-btn sticky-add-btn" type="button">+ Add document</button>
        </div>
      `;
    }
    if (this.listContainer) this.listContainer.innerHTML = html;
  }
}
