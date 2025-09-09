import type { NewDocument } from '../domain/Document';

export class DocumentForm {
  private container: HTMLElement;
  private onSubmit: (doc: NewDocument) => void;

  constructor(container: HTMLElement, onSubmit: (doc: NewDocument) => void) {
    this.container = container;
    this.onSubmit = onSubmit;
    this.render();
  }

  private render() {
    this.container.innerHTML = `
      <form id="document-form">
        <input type="text" name="title" placeholder="Document name" required />
        <input type="number" name="version" placeholder="Version" min="1" required />
        <input type="text" name="contributors" placeholder="Contributors (comma separated)" required />
        <input type="text" name="attachments" placeholder="Attachments (comma separated)" />
        <button type="submit">Create Document</button>
      </form>
    `;
    const form = this.container.querySelector('form') as HTMLFormElement;
    form.onsubmit = (e: Event) => {
      e.preventDefault();
      const data = new FormData(form);
      const doc: NewDocument = {
        title: data.get('title') as string,
        version: String(data.get('version')),
        contributors: (data.get('contributors') as string).split(',').map((name: string) => ({ id: '', name: name.trim() })).filter((c: { name: string }) => c.name),
        attachments: (data.get('attachments') as string).split(',').map((name: string) => name.trim()).filter((a: string) => a),
      };
      this.onSubmit(doc);
      form.reset();
    };
  }
}
