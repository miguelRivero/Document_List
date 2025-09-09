var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DocumentForm } from './DocumentForm.js';
import { fillAndSubmitForm } from '../../utils/fillAndSubmitForm.js';
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
    it('validates required fields and shows feedback', () => __awaiter(void 0, void 0, void 0, function* () {
        new DocumentForm(container, onSubmit);
        const form = container.querySelector('form#document-form');
        expect(form).not.toBeNull();
        if (form) {
            // Try to submit with all required fields empty
            fillAndSubmitForm(form, { title: '', version: '', contributors: [], attachments: [] });
            expect(container.innerHTML).toContain('Title is required.');
        }
    }));
    it('calls onSubmit with correct data', () => __awaiter(void 0, void 0, void 0, function* () {
        new DocumentForm(container, onSubmit);
        const form = container.querySelector('form#document-form');
        expect(form).not.toBeNull();
        if (form) {
            fillAndSubmitForm(form, {
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
            fillAndSubmitForm(form, {
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
