var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DocumentForm } from './DocumentForm.js';
describe('DocumentForm', () => {
    let container;
    let onSubmit;
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
    function fillAndSubmit(form, values) {
        const titleInput = form.querySelector('input[name="title"]');
        const versionInput = form.querySelector('input[name="version"]');
        const contributorsInput = form.querySelector('input[name="contributors"]');
        const attachmentsInput = form.querySelector('input[name="attachments"]');
        if (values.title && titleInput)
            titleInput.value = values.title;
        if (values.version && versionInput)
            versionInput.value = values.version;
        if (values.contributors && contributorsInput)
            contributorsInput.value = values.contributors.join(', ');
        if (values.attachments && attachmentsInput)
            attachmentsInput.value = values.attachments.join(', ');
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
    it('validates required fields and shows feedback', () => __awaiter(void 0, void 0, void 0, function* () {
        new DocumentForm(container, onSubmit);
        const form = container.querySelector('form#document-form');
        expect(form).not.toBeNull();
        if (form) {
            // Try to submit with all required fields empty
            fillAndSubmit(form, { title: '', version: '', contributors: [], attachments: [] });
            expect(container.innerHTML).toContain('Title is required.');
        }
    }));
    it('calls onSubmit with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        new DocumentForm(container, onSubmit);
        const form = container.querySelector('form#document-form');
        expect(form).not.toBeNull();
        if (form) {
            fillAndSubmit(form, {
                title: 'Test Doc',
                version: '2',
                contributors: ['Alice', 'Bob'],
                attachments: ['file1.pdf', 'file2.docx']
            });
            yield Promise.resolve();
            expect(onSubmit).toHaveBeenCalled();
            const calledWith = onSubmit.mock.calls[0][0];
            expect(calledWith.title).toBe('Test Doc');
            expect(calledWith.version).toBe('2');
            expect(Array.isArray(calledWith.contributors)).toBe(true);
            expect(calledWith.contributors.map((c) => c.name)).toEqual(['Alice', 'Bob']);
            expect(calledWith.attachments).toEqual(['file1.pdf', 'file2.docx']);
            expect(container.innerHTML).toContain('Document created successfully!');
        }
    }));
    it('shows error feedback if onSubmit throws', () => __awaiter(void 0, void 0, void 0, function* () {
        onSubmit = vi.fn().mockRejectedValue(new Error('fail'));
        new DocumentForm(container, onSubmit);
        const form = container.querySelector('form#document-form');
        expect(form).not.toBeNull();
        if (form) {
            fillAndSubmit(form, {
                title: 'Test Doc',
                version: '2',
                contributors: ['Alice'],
                attachments: ['file1.pdf']
            });
            yield Promise.resolve();
            expect(container.innerHTML).toContain('Error creating document');
        }
    }));
});
