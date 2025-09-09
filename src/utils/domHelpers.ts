// Simple helper to render HTML templates and attach them to the DOM
export function render(target: HTMLElement, html: string) {
  target.innerHTML = html;
}

// Helper to create an element from an HTML string
export function htmlToElement(html: string): HTMLElement {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild as HTMLElement;
}
