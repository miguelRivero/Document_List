export class DocumentList {
    constructor(container) {
        this.listContainer = null;
        this.view = 'list';
        this.container = container;
        this.renderHeaders();
    }
    renderHeaders() {
        this.container.innerHTML = `
      <div id="document-list"></div>
    `;
        this.listContainer = this.container.querySelector('#document-list');
    }
    update(documents, view = 'list') {
        this.view = view;
        if (!this.listContainer) {
            this.renderHeaders();
        }
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
                ${doc.contributors.map(c => c.name).join('<br>') || 'No contributors'}
              </div>
              <div class="document-attachments">
                ${Array.isArray(doc.attachments) && doc.attachments.length > 0 ? doc.attachments.join('<br>') : 'No attachments'}
              </div>
            </div>
          `).join('')}
        </div>
        <button class="add-document-btn sticky-add-btn" type="button">+ Add document</button>
      `;
        }
        else {
            html = `
        <div class="document-list grid scrollable-list">
          ${documents.map(doc => `
            <div class="document-item">
              <div class="document-name">${doc.title}<br><span>v${doc.version}</span></div>
              <div class="document-contributors">
                ${doc.contributors.map(c => c.name).join('<br>') || 'No contributors'}
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
        if (this.listContainer)
            this.listContainer.innerHTML = html;
    }
}
