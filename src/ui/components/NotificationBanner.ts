// Simple notification banner for real-time document creation
export class NotificationBanner {
  private container: HTMLElement;
  private hideBannerTimeout: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Show the notification banner with the specified document count.
   * @param count - The number of new documents.
   */
  show(count: number = 0) {
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
    const banner = this.container.querySelector('.notification-banner');
    if (banner) {
      // Force a reflow to ensure the CSS transition is properly applied
      void (banner as HTMLElement).offsetWidth;
      banner.classList.add('notification-banner--visible');
    }
    if (this.hideBannerTimeout) {
      clearTimeout(this.hideBannerTimeout);
    }
    this.hideBannerTimeout = window.setTimeout(() => {
      this.hideWithAnimation();
      this.hideBannerTimeout = null;
    }, 2000);
  }

  /**
   * Hide the notification banner with a CSS animation.
   */
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

  /** Clear the notification banner immediately. */
  clear() {
    this.container.innerHTML = '';
    this.container.style.display = 'none';
  }
}
