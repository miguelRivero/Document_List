var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Component to handle the document creation form with validation and feedback.
 * Includes accessibility features and user feedback.
 */
export class DocumentForm {
    constructor(container, onSubmit) {
        this.form = null;
        this.feedback = null;
        this.container = container;
        this.onSubmit = onSubmit;
        this.render();
    }
    /**
     * Renders the form HTML and sets the submit handler.
     */
    render() {
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
            const firstInput = this.form.querySelector('input[name="title"]');
            if (firstInput)
                setTimeout(() => firstInput.focus(), 0);
        }
    }
    /**
     * Sets feedback message for the user.
     * @param msg
     * @param type
     */
    setFeedback(msg, type = 'error') {
        if (this.feedback) {
            this.feedback.textContent = msg;
            this.feedback.style.color = type === 'error' ? '#c0392b' : '#218838';
        }
    }
    /**
     * Clears feedback message for the user.
     */
    clearFeedback() {
        if (this.feedback)
            this.feedback.textContent = '';
    }
    /**
     * Sets the loading state for the form.
     * @param loading Whether the form is in a loading state.
     */
    setLoading(loading) {
        if (!this.form)
            return;
        const btn = this.form.querySelector('.submit-btn');
        if (btn)
            btn.disabled = loading;
        btn.textContent = loading ? 'Creating…' : 'Create Document';
    }
    /**
     * Handles form submission.
     * @param e, Event
     */
    handleSubmit(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            if (!this.form)
                return;
            this.clearFeedback();
            const data = new FormData(this.form);
            const title = (data.get('title') || '').trim();
            const version = (data.get('version') || '').trim();
            const contributorsRaw = (data.get('contributors') || '').trim();
            const attachmentsRaw = (data.get('attachments') || '').trim();
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
            const doc = {
                title,
                version,
                contributors,
                attachments,
            };
            this.setLoading(true);
            try {
                yield this.onSubmit(doc);
                this.setFeedback('Document created successfully!', 'success');
                this.form.reset();
                const firstInput = this.form.querySelector('input[name="title"]');
                if (firstInput)
                    firstInput.focus();
            }
            catch (err) {
                this.setFeedback('Error creating document. Please try again.');
                console.error(err);
            }
            finally {
                this.setLoading(false);
            }
        });
    }
}
/**
 * Generates a random ID (uses crypto.randomUUID if available, else fallback).
 * @returns string
 */
function genId() {
    return (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
}
/**
 * Parses a comma-separated string into an array of trimmed strings.
 * @param str Comma-separated string
 * @returns string[]
 */
function parseCommaSeparated(str) {
    return str.split(',').map(s => s.trim()).filter(Boolean);
}
