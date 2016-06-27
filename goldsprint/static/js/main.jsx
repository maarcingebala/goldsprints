var React = require('react');
var ReactDOM = require('react-dom');


var Canvas = React.createClass({

  drawFace: function() {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.lineWidth = this.radius * 0.1;
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius * 0.1, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#333';
    this.ctx.fill();
  },

  drawHand: function(position) {
    // translate linear position to circular
    position = (position * 2 * Math.PI / this.props.distance);
    var length = this.radius * 0.9;
    var width = this.radius * 0.02;
    this.ctx.beginPath();
    this.ctx.lineWidth = width;
    this.ctx.lineCap = "round";
    this.ctx.moveTo(0,0);
    this.ctx.rotate(position);
    this.ctx.lineTo(0, -length);
    this.ctx.stroke();
    this.ctx.rotate(-position);
  },

  drawPlayerPosition: function() {
    this.drawFace();
    this.drawHand(this.props.position);
  },

  componentDidMount: function() {
    this.ctx = this.refs.canvas.getContext('2d');
    this.radius = this.refs.canvas.height / 2;
    this.ctx.translate(this.radius, this.radius);
    this.radius *= 0.9;
    this.drawPlayerPosition();
  },

  componentDidUpdate: function() {
    this.drawPlayerPosition();
  },

  render: function() {
    return (
      <canvas width="500" height="500" ref="canvas" />
    );
  }
});


class WSHandler {
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


var Container = React.createClass({

  resetCounter: function(event) {
    this.setState({
      position: 0,
      speed: 0,
      readWs: true
    });
  },

  toggleCounter: function(event) {
    this.setState({
      readWs: !this.state.readWs
    });
  },

  handleWSMessage: function(data) {
    if (this.state.readWs) {
      this.setState({
        position: parseFloat(data.position),
        speed: parseFloat(data.speedKmh)
      });
    }
  },

  getInitialState: function() {
    return {
      position: 50,
      speed: 0,
      readWs: true
    }
  },

  componentWillMount: function() {
    this.wsHandler = new WSHandler(this.handleWSMessage);
  },

  render: function() {
    return (
      <div>
        <Canvas position={this.state.position} distance="250" />
        <p>Position: {this.state.position}, speed: {this.state.speed}</p>
        <button onClick={this.toggleCounter}>Reset</button>
      </div>
    )
  }
});

ReactDOM.render(
  <Container />,
  document.getElementById('container')
);
