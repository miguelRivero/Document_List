import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DocumentWebSocket } from './DocumentWebSocket.js';
// Mock WebSocket global
class MockWebSocket {
    constructor(url) {
        this.onopen = null;
        this.onmessage = null;
        this.onclose = null;
        this.onerror = null;
        this.readyState = 0;
        this.url = url;
        MockWebSocket.instances.push(this);
    }
    send() { }
    close() {
        this.readyState = 3;
        if (this.onclose)
            this.onclose();
    }
}
MockWebSocket.instances = [];
globalThis.WebSocket = MockWebSocket;
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
