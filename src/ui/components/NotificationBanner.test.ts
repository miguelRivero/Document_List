
import { vi } from 'vitest';
import { NotificationBanner } from './NotificationBanner';

describe('NotificationBanner', () => {
  let container: HTMLElement;
  let banner: NotificationBanner;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    banner = new NotificationBanner(container);
  vi.useFakeTimers();
  });

  afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
    container.remove();
  });

  it('shows the banner with the document count', () => {
    banner.show(3);
    expect(container.innerHTML).toContain('notification-banner');
    expect(container.innerHTML).toContain('notification-badge');
    expect(container.innerHTML).toContain('3');
  });

  it('shows the banner without badge if count=0', () => {
    banner.show(0);
    expect(container.innerHTML).toContain('notification-banner');
    expect(container.innerHTML).not.toContain('notification-badge');
  });

  it('hides the banner after the timeout', () => {
    banner.show(2);
  vi.advanceTimersByTime(2000);
    const notification_banner = container.querySelector('.notification-banner');
    if (notification_banner) {
      const event = new Event('transitionend');
      notification_banner.dispatchEvent(event);
    }
    expect(container.innerHTML).toBe('');
    expect(container.style.display).toBe('none');
  });

  it('clear() hides the banner immediately', () => {
    banner.show(1);
    banner.clear();
    expect(container.innerHTML).toBe('');
    expect(container.style.display).toBe('none');
  });
});
