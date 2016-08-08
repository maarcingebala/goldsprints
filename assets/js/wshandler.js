export class WSHandler {
  constructor(onMessageCallback) {
    let ws = new WebSocket("ws://localhost:8765/");

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

export function parseWsData(props, data) {
  let speedA = parseFloat(data.speed_a);
  let speedB = parseFloat(data.speed_b);
  let interval = parseFloat(data.interval);
  let newPositionA = props.positionA + speedA * interval;
  let newPositionB = props.positionB + speedB * interval;

  newPositionA = Math.round(newPositionA * 1000) / 1000;
  newPositionB = Math.round(newPositionB * 1000) / 1000;
  let raceTime = props.raceTime + interval;

  return {
    speedA: speedA,
    speedB: speedB,
    newPositionA: newPositionA,
    newPositionB: newPositionB,
    raceTime: raceTime
  }
}
