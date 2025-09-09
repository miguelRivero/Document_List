// Simple notification banner for real-time document creation
export class NotificationBanner {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  show(message: string) {
    this.container.innerHTML = `<div class="notification-banner">${message}</div>`;
    setTimeout(() => this.clear(), 4000);
  }

  clear() {
    this.container.innerHTML = '';
  }
}
