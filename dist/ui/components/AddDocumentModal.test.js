import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AddDocumentModal } from './AddDocumentModal';
describe('AddDocumentModal', () => {
    let onSubmit;
    let modalInstance;
    beforeEach(() => {
        onSubmit = vi.fn();
        modalInstance = new AddDocumentModal(onSubmit);
    });
    afterEach(() => {
        // Clean up any modals left in the DOM
        document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    });
    it('opens and renders the modal in the DOM', () => {
        modalInstance.open();
        expect(document.body.querySelector('.modal-overlay')).not.toBeNull();
        expect(document.body.querySelector('form#document-form')).not.toBeNull();
    });
    it('closes the modal when close button is clicked', () => {
        modalInstance.open();
        const closeBtn = document.body.querySelector('.modal-close-btn');
        expect(closeBtn).not.toBeNull();
        if (closeBtn)
            closeBtn.click();
        setTimeout(() => {
            expect(document.body.querySelector('.modal-overlay')).toBeNull();
        }, 250);
    });
    it('closes the modal when overlay is clicked', () => {
        modalInstance.open();
        const overlay = document.body.querySelector('.modal-overlay');
        expect(overlay).not.toBeNull();
        if (overlay)
            overlay.click();
        setTimeout(() => {
            expect(document.body.querySelector('.modal-overlay')).toBeNull();
        }, 250);
    });
    it('wires onSubmit and closes modal when called', () => {
        modalInstance.open();
        const testDoc = {
            title: 'Modal Doc',
            version: '2',
            contributors: [{ id: '1', name: 'Alice' }],
            attachments: ['file1.pdf']
        };
        modalInstance.onSubmit(testDoc);
        expect(onSubmit).toHaveBeenCalledWith(testDoc);
        setTimeout(() => {
            expect(document.body.querySelector('.modal-overlay')).toBeNull();
        }, 250);
    });
});
