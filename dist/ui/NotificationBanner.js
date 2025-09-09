// Simple notification banner for real-time document creation
export class NotificationBanner {
    constructor(container) {
        this.container = container;
    }
    show(message) {
        this.container.innerHTML = `<div class="notification-banner">${message}</div>`;
        setTimeout(() => this.clear(), 4000);
    }
    clear() {
        this.container.innerHTML = '';
    }
}
