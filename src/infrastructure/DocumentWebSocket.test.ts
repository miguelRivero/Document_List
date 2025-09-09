import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DocumentWebSocket } from './DocumentWebSocket.js';

// Mock WebSocket global
class MockWebSocket {
  static instances: MockWebSocket[] = [];
  public onopen: (() => void) | null = null;
  public onmessage: ((event: { data: string }) => void) | null = null;
  public onclose: (() => void) | null = null;
  public onerror: (() => void) | null = null;
  public readyState = 0;
  public url: string;
  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }
  send() { }
  close() {
    this.readyState = 3;
    if (this.onclose) this.onclose();
  }
}

globalThis.WebSocket = MockWebSocket as any;

describe('DocumentWebSocket', () => {
  beforeEach(() => {
    MockWebSocket.instances.length = 0;
  });

  it('should connect and use the correct WebSocket URL', () => {
    const ws = new DocumentWebSocket();
    const cb = vi.fn();
    ws.connect(cb);
    expect(MockWebSocket.instances.length).toBe(1);
    const instance = MockWebSocket.instances[0];
    expect(instance.url).toBe('ws://localhost:8080/notifications');
  });

  it('should call callback on message', () => {
    const ws = new DocumentWebSocket();
    const cb = vi.fn();
    ws.connect(cb);
    const instance = MockWebSocket.instances[0];
    // Simulate message
    instance.onmessage && instance.onmessage({ data: 'test' });
    expect(cb).toHaveBeenCalled();
  });

  it('should close the connection', () => {
    const ws = new DocumentWebSocket();
    ws.connect(() => { });
    const instance = MockWebSocket.instances[0];
    ws.disconnect();
    expect(instance.readyState).toBe(3); // CLOSED
  });
});
