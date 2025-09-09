import { describe, it, expect, beforeEach } from 'vitest';
import { render, htmlToElement } from './domHelpers.js';
describe('domHelpers', () => {
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(() => {
        container.remove();
    });
    describe('render', () => {
        it('renders HTML into the target element', () => {
            render(container, '<span id="test-span">Hello</span>');
            const span = container.querySelector('#test-span');
            expect(span).not.toBeNull();
            expect(span === null || span === void 0 ? void 0 : span.textContent).toBe('Hello');
        });
        it('overwrites previous content', () => {
            container.innerHTML = '<div>Old</div>';
            render(container, '<div>New</div>');
            expect(container.innerHTML).toBe('<div>New</div>');
        });
    });
    describe('htmlToElement', () => {
        it('converts HTML string to HTMLElement', () => {
            const el = htmlToElement('<button class="btn">Click</button>');
            expect(el).toBeInstanceOf(HTMLElement);
            expect(el.tagName).toBe('BUTTON');
            expect(el.className).toBe('btn');
            expect(el.textContent).toBe('Click');
        });
        it('trims whitespace from HTML string', () => {
            const el = htmlToElement('   <div id="trimmed">Trim</div>   ');
            expect(el.id).toBe('trimmed');
            expect(el.textContent).toBe('Trim');
        });
    });
});
