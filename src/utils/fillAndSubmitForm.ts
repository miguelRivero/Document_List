/**
 * Fills and submits a document form in a container for testing purposes.
 * @param container The HTMLElement containing the form (usually document.body or the modal root)
 * @param values The values to fill in the form fields
 */
export function fillAndSubmitForm(
  container: HTMLElement,
  values: { title: string; version: string; contributors: string[]; attachments: string[] }
) {
  // Find the form inside the container
  const form = container.querySelector('form#document-form') as HTMLFormElement | null;
  if (!form) {
    throw new Error('Form with id "document-form" not found in container.');
  }

  const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement | null;
  const versionInput = form.querySelector('input[name="version"]') as HTMLInputElement | null;
  const contributorsInput = form.querySelector('input[name="contributors"]') as HTMLInputElement | null;
  const attachmentsInput = form.querySelector('input[name="attachments"]') as HTMLInputElement | null;

  if (titleInput) {
    titleInput.value = values.title;
    titleInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  if (versionInput) {
    versionInput.value = values.version;
    versionInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  if (contributorsInput) {
    contributorsInput.value = values.contributors.join(', ');
    contributorsInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
  if (attachmentsInput) {
    attachmentsInput.value = values.attachments.join(', ');
    attachmentsInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Submit the form
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}