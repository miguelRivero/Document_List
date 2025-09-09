/**
 * Fills and submits a document form in a container for testing purposes.
 * @param container The HTMLElement containing the form (usually document.body or the modal root)
 * @param values The values to fill in the form fields
 */
export function fillAndSubmitForm(
  container: HTMLElement,
  values: { title: string; version: string; contributors: string[]; attachments: string[] }
) {
  const titleInput = container.querySelector('input[name="title"]') as HTMLInputElement | null;
  const versionInput = container.querySelector('input[name="version"]') as HTMLInputElement | null;
  const contributorsInput = container.querySelector('input[name="contributors"]') as HTMLInputElement | null;
  const attachmentsInput = container.querySelector('input[name="attachments"]') as HTMLInputElement | null;
  if (values.title && titleInput) titleInput.value = values.title;
  if (values.version && versionInput) versionInput.value = values.version;
  if (values.contributors && contributorsInput) contributorsInput.value = values.contributors.join(', ');
  if (values.attachments && attachmentsInput) attachmentsInput.value = values.attachments.join(', ');
  const form = container.querySelector('form#document-form') as HTMLFormElement | null;
  if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}
