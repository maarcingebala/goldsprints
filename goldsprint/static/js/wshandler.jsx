export class WSHandler {
  constructor(onMessageCallback) {
    var ws = new WebSocket("ws://localhost:8765/");

    ws.onmessage = function(event) {
      var data = JSON.parse(event.data);
      onMessageCallback(data);
    };

    ws.onerror = function() {
      console.log("Failed to establish WS connection");
      this.connected = false;
    };

    ws.onclose = function() {
      console.log("WS connection closed");
      this.connected = false;
    };

    this.connected = true;
    this.ws = ws;
  }
}