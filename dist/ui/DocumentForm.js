export class DocumentForm {
    constructor(container, onSubmit) {
        this.container = container;
        this.onSubmit = onSubmit;
        this.render();
    }
    render() {
        this.container.innerHTML = `
      <form id="document-form">
        <input type="text" name="title" placeholder="Document name" required />
        <input type="number" name="version" placeholder="Version" min="1" required />
        <input type="text" name="contributors" placeholder="Contributors (comma separated)" required />
        <input type="text" name="attachments" placeholder="Attachments (comma separated)" />
        <button type="submit">Create Document</button>
      </form>
    `;
        const form = this.container.querySelector('form');
        form.onsubmit = (e) => {
            e.preventDefault();
            const data = new FormData(form);
            const doc = {
                title: data.get('title'),
                version: String(data.get('version')),
                contributors: data.get('contributors').split(',').map((name) => ({ id: '', name: name.trim() })).filter((c) => c.name),
                attachments: data.get('attachments').split(',').map((name) => name.trim()).filter((a) => a),
            };
            this.onSubmit(doc);
            form.reset();
        };
    }
}
