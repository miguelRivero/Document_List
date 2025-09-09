/**
 * Renders HTML content into a target element.
 * @param target Target HTML element to render into
 * @param html
 */
export function render(target, html) {
    target.innerHTML = html;
}
/**
 * Converts a string of HTML into an HTMLElement.
 * @param html String of HTML to convert to an HTMLElement
 * @returns The created HTMLElement
 */
export function htmlToElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}
