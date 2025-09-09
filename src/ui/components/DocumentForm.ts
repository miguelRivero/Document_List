/**
 * Converts a comma-separated string to an array of trimmed, non-empty strings.
 */
import type { NewDocument } from '../../domain/Document';

/**
 * Component to handle the document creation form with validation and feedback.
 * Includes accessibility features and user feedback.
 */
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

  /**
   * Renders the form HTML and sets the submit handler.
   */
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
      const firstInput = this.form.querySelector('input[name="title"]') as HTMLInputElement;
      if (firstInput) setTimeout(() => firstInput.focus(), 0);
    }
  }

  /**
   * Sets feedback message for the user.
   * @param msg 
   * @param type 
   */
  private setFeedback(msg: string, type: 'error' | 'success' = 'error') {
    if (this.feedback) {
      this.feedback.textContent = msg;
      this.feedback.style.color = type === 'error' ? '#c0392b' : '#218838';
    }
  }

  /**
   * Clears feedback message for the user.
   */
  private clearFeedback() {
    if (this.feedback) this.feedback.textContent = '';
  }

  /**
   * Sets the loading state for the form.
   * @param loading Whether the form is in a loading state.
   */
  private setLoading(loading: boolean) {
    if (!this.form) return;
    const btn = this.form.querySelector('.submit-btn') as HTMLButtonElement;
    if (btn) btn.disabled = loading;
    btn.textContent = loading ? 'Creating…' : 'Create Document';
  }

  /**
   * Handles form submission.
   * @param e, Event  
   */
  private async handleSubmit(e: Event) {
    e.preventDefault();
    if (!this.form) return;
    this.clearFeedback();
    const data = new FormData(this.form);
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
    if (!attachmentsRaw) {
      this.setFeedback('At least one contributor is required.');
      return;
    }

    // Process contributors as array of objects with random id
    const contributors = contributorsRaw
      ? parseCommaSeparated(contributorsRaw).map(name => ({ id: genId(), name }))
      : [];

    // Process attachments as array of strings
    const attachments = attachmentsRaw
      ? parseCommaSeparated(attachmentsRaw)
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
      console.error(err);
    } finally {
      this.setLoading(false);
    }
  }
}

/**
 * Generates a random ID (uses crypto.randomUUID if available, else fallback).
 * @returns string
 */
function genId(): string {
  return (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/**
 * Parses a comma-separated string into an array of trimmed strings.
 * @param str Comma-separated string
 * @returns string[]
 */
function parseCommaSeparated(str: string): string[] {
  return str.split(',').map(s => s.trim()).filter(Boolean);
}