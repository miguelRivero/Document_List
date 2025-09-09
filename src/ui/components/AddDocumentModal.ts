import { DocumentForm } from './DocumentForm.js';
import type { NewDocument } from '../../domain/Document';

/**
 * Modal that contains the DocumentForm for adding a new document.
 * It handles opening and closing the modal, as well as submitting the form data.
 */
export class AddDocumentModal {
  private modal: HTMLDivElement;
  private overlay: HTMLDivElement;
  private onSubmit: (doc: NewDocument) => void;

  constructor(onSubmit: (doc: NewDocument) => void) {
    this.onSubmit = onSubmit;

    // Create modal elements
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.modal = document.createElement('div');
    this.modal.className = 'modal-content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.type = 'button';
    closeBtn.addEventListener('click', () => this.close());
    this.modal.appendChild(closeBtn);

    // Form container
    const formContainer = document.createElement('div');
    formContainer.className = 'modal-form-container';
    this.modal.appendChild(formContainer);

    // Instantiate DocumentForm inside the modal
    new DocumentForm(formContainer, (doc) => {
      this.onSubmit(doc);
      this.close();
    });

    this.overlay.appendChild(this.modal);
  }

  /**
   * Opens the modal by appending it to the body and making it visible.
   */
  open() {
    document.body.appendChild(this.overlay);
    setTimeout(() => this.overlay.classList.add('open'), 10);
  }

  /**
   * Closes the modal by removing it from the DOM.
   * Includes a slight delay to allow for CSS transition effects.
   */
  close() {
    this.overlay.classList.remove('open');
    setTimeout(() => {
      if (this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
    }, 200);
  }
}
