/**
 * Manages WebSocket connections to receive real-time document notifications.
 * The server sends notifications with the following structure:
 * {
 *   Timestamp: string,
 *   UserID: string,
 *   UserName: string,
 *   DocumentID: string,
 *   DocumentTitle: string
 * }
 */
export class DocumentWebSocket {
  // Holds the WebSocket instance
  private ws: WebSocket | null = null;
  // The WebSocket server URL (as specified by the server README)
  private readonly url = 'ws://localhost:8080/notifications';

  /**
   * Opens a WebSocket connection and listens for new document notifications.
   * The callback is called every time a new document event is received (content is ignored).
   */
  connect(onEvent: () => void) {
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = () => {
      // Just trigger the callback - let the main app handle fetching fresh data
      onEvent();
    };
  }

  /**
   * Closes the WebSocket connection if it is open.
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}