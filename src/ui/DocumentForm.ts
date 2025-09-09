import { NewCustomerDocument } from '../domain/Document';

export class DocumentForm {
  private container: HTMLElement;
  private onSubmit: (doc: NewCustomerDocument) => void;

  constructor(container: HTMLElement, onSubmit: (doc: NewCustomerDocument) => void) {
    this.container = container;
    this.onSubmit = onSubmit;
    this.render();
  }

  private render() {
    this.container.innerHTML = `
      <form id="document-form">
        <input type="text" name="name" placeholder="Document name" required />
        <input type="number" name="version" placeholder="Version" min="1" required />
        <input type="text" name="contributors" placeholder="Contributors (comma separated)" required />
        <input type="text" name="attachments" placeholder="Attachments (comma separated)" />
        <button type="submit">Create Document</button>
      </form>
    `;
    const form = this.container.querySelector('form')!;
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const doc: NewCustomerDocument = {
        name: data.get('name') as string,
        version: Number(data.get('version')),
        contributors: (data.get('contributors') as string).split(',').map(name => ({ id: '', name: name.trim() })).filter(c => c.name),
        attachments: (data.get('attachments') as string).split(',').map(name => ({ id: '', name: name.trim(), url: '' })).filter(a => a.name),
      };
      this.onSubmit(doc);
      form.reset();
    };
  }
