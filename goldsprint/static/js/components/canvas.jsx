var React = require('react');

export const Canvas = React.createClass({

  propTypes: {
    position: React.PropTypes.number.isRequired,
    distance: React.PropTypes.number.isRequired
  },

  drawFace: function() {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();

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
      <canvas id="gameCanvas" width="500" height="500" ref="canvas" />
    );
  }
});
