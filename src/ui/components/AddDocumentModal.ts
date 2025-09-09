import { DocumentForm } from './DocumentForm.js';
import type { NewDocument } from '../../domain/Document';

export class AddDocumentModal {
  private modal: HTMLDivElement;
  private overlay: HTMLDivElement;
  private onSubmit: (doc: NewDocument) => void;

  constructor(onSubmit: (doc: NewDocument) => void) {
    this.onSubmit = onSubmit;
    // Crear overlay y modal
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.modal = document.createElement('div');
    this.modal.className = 'modal-content';
    // Botón cerrar
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.type = 'button';
    closeBtn.addEventListener('click', () => this.close());
    this.modal.appendChild(closeBtn);

    // Contenedor para el formulario
    const formContainer = document.createElement('div');
    formContainer.className = 'modal-form-container';
    this.modal.appendChild(formContainer);

    // Instanciar DocumentForm
    new DocumentForm(formContainer, (doc) => {
      this.onSubmit(doc);
      this.close();
    });

    this.overlay.appendChild(this.modal);
  }

  open() {
    document.body.appendChild(this.overlay);
    setTimeout(() => this.overlay.classList.add('open'), 10);
  }

  close() {
    this.overlay.classList.remove('open');
    setTimeout(() => {
      if (this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
    }, 200);
  }
}
