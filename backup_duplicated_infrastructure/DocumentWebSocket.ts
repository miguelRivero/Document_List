import type { ApiDocument } from '../domain/Document';
// This class manages the WebSocket connection to receive real-time document notifications from the server.
export class DocumentWebSocket {
  // Holds the WebSocket instance
  private ws: WebSocket | null = null;
  // The WebSocket server URL (as specified by the server README)
  private readonly url = 'ws://localhost:8080/notifications';

  /**
   * Opens a WebSocket connection and listens for new document notifications.
   * The callback is called every time a new document is created by another user.
   * The server sends notifications with the following structure:
   * {
   *   Timestamp: string,
   *   UserID: string,
   *   UserName: string,
   *   DocumentID: string,
   *   DocumentTitle: string
   * }
   */
  connect(onNotification: (notification: ApiDocument) => void) {
    // Create a new WebSocket connection to the server
    this.ws = new WebSocket(this.url);
    // Listen for incoming messages from the server
    this.ws.onmessage = (event) => {
      try {
        // Parse the received message as JSON
        const data = JSON.parse(event.data);
        // Call the callback with the notification data
        onNotification(data);
      } catch (e) {
        // Log parsing errors to the console
        console.error('WebSocket message parsing error:', e, event.data);
      }
    };
  }
}
