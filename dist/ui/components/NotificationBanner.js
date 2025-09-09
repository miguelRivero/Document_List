// Simple notification banner for real-time document creation
export class NotificationBanner {
    constructor(container) {
        this.timeoutId = null;
        this.container = container;
    }
    show(count = 0) {
        this.container.innerHTML = `
      <div class="notification-banner notification-banner--enter">
        <span class="notification-icon">
          <img src="./assets/bell.svg" width="20" height="20" alt="Bell icon" />
          ${count > 0 ? `<span class=\"notification-badge\">${count}</span>` : ''}
        </span>
        <span>New document added</span>
      </div>
    `;
        this.container.style.display = 'block';
        // Forzar reflow para activar la transición
        const banner = this.container.querySelector('.notification-banner');
        if (banner) {
            void banner.offsetWidth;
            banner.classList.add('notification-banner--visible');
        }
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = window.setTimeout(() => {
            this.hideWithAnimation();
            this.timeoutId = null;
        }, 2000);
    }
    hideWithAnimation() {
        const banner = this.container.querySelector('.notification-banner');
        if (banner) {
            banner.classList.remove('notification-banner--visible');
            banner.classList.add('notification-banner--leave');
            banner.addEventListener('transitionend', () => {
                this.clear();
            }, { once: true });
        }
        else {
            this.clear();
        }
    }
    clear() {
        this.container.innerHTML = '';
        this.container.style.display = 'none';
    }
}
