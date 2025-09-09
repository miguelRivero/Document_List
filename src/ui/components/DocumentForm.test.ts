import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DocumentForm } from './DocumentForm.js';
import type { NewDocument } from '../../domain/Document';

describe('DocumentForm', () => {
  let container: HTMLElement;
  let onSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    onSubmit = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    container.remove();
  });

  /**
   * Fills the form with the provided values and submits it.
   * @param form The form element to fill and submit.
   * @param values The values to fill in the form.
   * Contributors are omitted from the NewDocument type and added as a string array to mimic the user input.
   */
  function fillAndSubmit(
    form: HTMLFormElement,
    values: Partial<Omit<NewDocument, 'contributors'> & { contributors?: string[] }>
  ) {
    const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement | null;
    const versionInput = form.querySelector('input[name="version"]') as HTMLInputElement | null;
    const contributorsInput = form.querySelector('input[name="contributors"]') as HTMLInputElement | null;
    const attachmentsInput = form.querySelector('input[name="attachments"]') as HTMLInputElement | null;
    if (values.title && titleInput) titleInput.value = values.title;
    if (values.version && versionInput) versionInput.value = values.version;
    if (values.contributors && contributorsInput) contributorsInput.value = values.contributors.join(', ');
    if (values.attachments && attachmentsInput) attachmentsInput.value = values.attachments.join(', ');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  it('validates required fields and shows feedback', async () => {
    new DocumentForm(container, onSubmit);
    const form = container.querySelector('form#document-form') as HTMLFormElement | null;
    expect(form).not.toBeNull();
    if (form) {
      // Try to submit with all required fields empty
      fillAndSubmit(form, { title: '', version: '', contributors: [], attachments: [] });
      expect(container.innerHTML).toContain('Title is required.');
    }
  });

  it('calls onSubmit with correct data', async () => {
    new DocumentForm(container, onSubmit);
    const form = container.querySelector('form#document-form') as HTMLFormElement | null;
    expect(form).not.toBeNull();
    if (form) {
      fillAndSubmit(form, {
        title: 'Test Doc',
        version: '2',
        contributors: ['Alice', 'Bob'],
        attachments: ['file1.pdf', 'file2.docx']
      });
      await Promise.resolve();
      expect(onSubmit).toHaveBeenCalled();
      const calledWith = onSubmit.mock.calls[0][0];
      expect(calledWith.title).toBe('Test Doc');
      expect(calledWith.version).toBe('2');
      expect(Array.isArray(calledWith.contributors)).toBe(true);
      expect(calledWith.contributors.map((c: any) => c.name)).toEqual(['Alice', 'Bob']);
      expect(calledWith.attachments).toEqual(['file1.pdf', 'file2.docx']);
      expect(container.innerHTML).toContain('Document created successfully!');
    }
  });

  it('shows error feedback if onSubmit throws', async () => {
    onSubmit = vi.fn().mockRejectedValue(new Error('fail'));
    new DocumentForm(container, onSubmit);
    const form = container.querySelector('form#document-form') as HTMLFormElement | null;
    expect(form).not.toBeNull();
    if (form) {
      fillAndSubmit(form, {
        title: 'Test Doc',
        version: '2',
        contributors: ['Alice'],
        attachments: ['file1.pdf']
      });
      await Promise.resolve();
      expect(container.innerHTML).toContain('Error creating document');
    }
  });
});
