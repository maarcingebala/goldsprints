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

export function parseWsData(wsData, oldPositionA, oldPositionB, oldRaceTime) {
  const speedA = parseFloat(wsData.speed_a);
  const speedB = parseFloat(wsData.speed_b);
  const interval = parseFloat(wsData.interval);
  let newPositionA = oldPositionA + speedA * interval;
  let newPositionB = oldPositionB + speedB * interval;

  newPositionA = Math.round(newPositionA * 1000) / 1000;
  newPositionB = Math.round(newPositionB * 1000) / 1000;
  const raceTime = oldRaceTime + interval;

  return { speedA, speedB, newPositionA, newPositionB, raceTime }
}
