// Simple notification banner for real-time document creation
export class NotificationBanner {
  private container: HTMLElement;
  private timeoutId: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  show() {
      this.container.innerHTML = `
        <div class="notification-banner notification-banner--enter">
          <img src="./assets/bell.svg" width="20" height="20" alt="Bell icon" style="margin-right:0.5em;display:inline-block;vertical-align:middle;" />
          <span>New document added</span>
        </div>
      `;
      this.container.style.display = 'block';
      // Forzar reflow para activar la transición
      const banner = this.container.querySelector('.notification-banner');
      if (banner) {
        void (banner as HTMLElement).offsetWidth;
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
      } else {
        this.clear();
      }
    }

    clear() {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
  }
}
