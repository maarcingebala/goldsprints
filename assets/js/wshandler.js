export class WSHandler {

  constructor(onMessageCallback) {
    const ws = new WebSocket("ws://localhost:8765/");

    ws.onmessage = (event) => {
      onMessageCallback(JSON.parse(event.data));
    };

    ws.onerror = () => {
      this.connected = false;
      console.log("Failed to establish WS connection");
    };

    ws.onopen = () => {
      this.connected = true;
      console.log("Connected to webscocket");
    }

    ws.onclose = () => {
      this.connected = false;
      console.log("WS connection closed");
    };
  }

}


export function parseWsData(wsData) {
  // todo: probably map() or something similar would help here 
  const speedA = parseFloat(wsData.speed_a);
  const speedB = parseFloat(wsData.speed_b);
  const interval = parseFloat(wsData.interval);
  const deltaA = parseFloat(wsData.delta_a);
  const deltaB = parseFloat(wsData.delta_b);
  return { speedA, speedB, deltaA, deltaB }
}
