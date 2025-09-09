// This class manages the WebSocket connection to receive real-time document notifications from the server.
export class DocumentWebSocket {
    constructor() {
        // Holds the WebSocket instance
        this.ws = null;
        // The WebSocket server URL (as specified by the server README)
        this.url = 'ws://localhost:8080/notifications';
    }
    /**
     * Opens a WebSocket connection and listens for new document notifications.
     * The callback is called every time a new document event is received (content is ignored).
     */
    connect(onEvent) {
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = () => {
            onEvent();
        };
    }
    /**
     * Closes the WebSocket connection if it is open.
     */
    disconnect() {
        if (this.ws) {
            this.ws.close(); // Close the connection
            this.ws = null;
        }
    }
}
