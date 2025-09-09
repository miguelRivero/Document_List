import type { NewDocument } from '../../domain/Document';

export class DocumentForm {
  private container: HTMLElement;
  private onSubmit: (doc: NewDocument) => void;
  private form: HTMLFormElement | null = null;
  private feedback: HTMLDivElement | null = null;

  constructor(container: HTMLElement, onSubmit: (doc: NewDocument) => void) {
    this.container = container;
    this.onSubmit = onSubmit;
    this.render();
  }

  private render() {
    this.container.innerHTML = `
      <form id="document-form" aria-label="Add document form" autocomplete="off" novalidate>
        <label>
          Name
          <input type="text" name="title" placeholder="Document name" required aria-required="true" autocomplete="off" />
        </label>
        <label>
          Version
          <input type="number" name="version" placeholder="Version" min="1" step="any" required aria-required="true" autocomplete="off" />
        </label>
        <label>
          Contributors
          <input type="text" name="contributors" placeholder="Contributors (comma separated)" required aria-required="true" autocomplete="off" />
        </label>
        <label>
          Attachments
          <input type="text" name="attachments" placeholder="Attachments (comma separated)" autocomplete="off" />
        </label>
        <button type="submit" class="submit-btn">Create Document</button>
        <div class="form-feedback" aria-live="polite" style="margin-top:1em;"></div>
      </form>
    `;
    this.form = this.container.querySelector('form');
    this.feedback = this.container.querySelector('.form-feedback');
    if (this.form) {
      this.form.onsubmit = (e) => this.handleSubmit(e);
      // Accesibilidad: foco en el primer campo
      const firstInput = this.form.querySelector('input[name="title"]') as HTMLInputElement;
      if (firstInput) setTimeout(() => firstInput.focus(), 0);
    }
  }

  private setFeedback(msg: string, type: 'error' | 'success' = 'error') {
    if (this.feedback) {
      this.feedback.textContent = msg;
      this.feedback.style.color = type === 'error' ? '#c0392b' : '#218838';
    }
  }

  private clearFeedback() {
    if (this.feedback) this.feedback.textContent = '';
  }

  private setLoading(loading: boolean) {
    if (!this.form) return;
    const btn = this.form.querySelector('.submit-btn') as HTMLButtonElement;
    if (btn) btn.disabled = loading;
    btn.textContent = loading ? 'Creating…' : 'Create Document';
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    if (!this.form) return;
    this.clearFeedback();
    const data = new FormData(this.form);
    // Validación avanzada
  const title = (data.get('title') as string || '').trim();
  const version = (data.get('version') as string || '').trim();
  const contributorsRaw = (data.get('contributors') as string || '').trim();
  const attachmentsRaw = (data.get('attachments') as string || '').trim();

    if (!title) {
      this.setFeedback('Title is required.');
      return;
    }
    if (!version) {
      this.setFeedback('Version is required.');
      return;
    }
    if (!contributorsRaw) {
      this.setFeedback('At least one contributor is required.');
      return;
    }
    // Process contributors and attachments
    const contributors = contributorsRaw.split(',').map(name => ({ id: '', name: name.trim() })).filter(c => c.name);
    if (contributors.length === 0) {
      this.setFeedback('At least one valid contributor is required.');
      return;
    }
    const attachments = attachmentsRaw
      ? attachmentsRaw.split(',').map(url => url.trim()).filter(Boolean)
      : [];

    const doc: NewDocument = {
      title,
      version,
      contributors,
      attachments,
    };

    this.setLoading(true);
    try {
      await this.onSubmit(doc);
      this.setFeedback('Document created successfully!', 'success');
      this.form.reset();
      const firstInput = this.form.querySelector('input[name="title"]') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    } catch (err: any) {
      this.setFeedback('Error creating document. Please try again.');
      console.eror(err);
    } finally {
      this.setLoading(false);
    }
  }
}
