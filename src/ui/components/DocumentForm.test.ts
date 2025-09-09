import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DocumentForm } from './DocumentForm.js';
import { fillAndSubmitForm } from '../../utils/fillAndSubmitForm.js';

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

  it('validates required fields and shows feedback', async () => {
    new DocumentForm(container, onSubmit);

    // Wait for the form to render
    await Promise.resolve();

    const form = container.querySelector('form#document-form') as HTMLFormElement | null;
    expect(form).not.toBeNull();

    // Pass the container (not the form) to fillAndSubmitForm
    fillAndSubmitForm(container, { title: '', version: '', contributors: [], attachments: [] });

    // Wait for validation feedback
    await Promise.resolve();

    expect(container.innerHTML).toContain('Title is required.');
  });

  it('calls onSubmit with correct data', async () => {
    new DocumentForm(container, onSubmit);

    // Wait for the form to render
    await Promise.resolve();

    const form = container.querySelector('form#document-form') as HTMLFormElement | null;
    expect(form).not.toBeNull();

    // Pass the container (not the form) to fillAndSubmitForm
    fillAndSubmitForm(container, {
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
  });

  it('shows error feedback if onSubmit throws', async () => {
    onSubmit = vi.fn().mockRejectedValue(new Error('fail'));
    new DocumentForm(container, onSubmit);

    // Wait for the form to render
    await Promise.resolve();

    const form = container.querySelector('form#document-form') as HTMLFormElement | null;
    expect(form).not.toBeNull();

    // Pass the container (not the form) to fillAndSubmitForm
    fillAndSubmitForm(container, {
      title: 'Test Doc',
      version: '2',
      contributors: ['Alice'],
      attachments: ['file1.pdf']
    });

    await Promise.resolve();

    expect(container.innerHTML).toContain('Error creating document');
  });
});