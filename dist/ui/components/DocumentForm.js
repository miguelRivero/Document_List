var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class DocumentForm {
    constructor(container, onSubmit) {
        this.form = null;
        this.feedback = null;
        this.container = container;
        this.onSubmit = onSubmit;
        this.render();
    }
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
            // Accesibilidad: foco en el primer campo
            const firstInput = this.form.querySelector('input[name="title"]');
            if (firstInput)
                setTimeout(() => firstInput.focus(), 0);
        }
    }
    setFeedback(msg, type = 'error') {
        if (this.feedback) {
            this.feedback.textContent = msg;
            this.feedback.style.color = type === 'error' ? '#c0392b' : '#218838';
        }
    }
    clearFeedback() {
        if (this.feedback)
            this.feedback.textContent = '';
    }
    setLoading(loading) {
        if (!this.form)
            return;
        const btn = this.form.querySelector('.submit-btn');
        if (btn)
            btn.disabled = loading;
        btn.textContent = loading ? 'Creating…' : 'Create Document';
    }
    handleSubmit(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            if (!this.form)
                return;
            this.clearFeedback();
            const data = new FormData(this.form);
            // Validación avanzada
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
            // Process contributors and attachments
            const contributors = contributorsRaw.split(',').map(name => ({ id: '', name: name.trim() })).filter(c => c.name);
            if (contributors.length === 0) {
                this.setFeedback('At least one valid contributor is required.');
                return;
            }
            const attachments = attachmentsRaw
                ? attachmentsRaw.split(',').map(url => url.trim()).filter(Boolean)
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
                console.eror(err);
            }
            finally {
                this.setLoading(false);
            }
        });
    }
}
