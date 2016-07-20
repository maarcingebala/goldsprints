import React from 'react';

class RaceCanvas extends React.Component {

  drawFace(context) {
    context.beginPath();
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    context.lineWidth = 10;
    context.fillStyle = 'white';
    context.fill();

    context.beginPath();
    context.arc(0, 0, this.radius * 0.1, 0, 2 * Math.PI);
    context.fillStyle = '#333';
    context.fill();
  }

  drawHand(context, position, color) {
    // translate linear position to circular
    position = (position * 2 * Math.PI / this.props.distance);
    var length = this.radius * 0.9;
    var width = this.radius * 0.02;
    context.beginPath();
    context.lineWidth = width;
    context.lineCap = "round";
    context.moveTo(0, 0);
    context.rotate(position);
    context.lineTo(0, -length);
    context.strokeStyle = color;
    context.stroke();
    context.rotate(-position);
  }

  drawPlayerPosition() {
    this.drawFace(this.ctx);
    this.drawHand(this.ctx, this.props.positionA, 'red');
    this.drawHand(this.ctx, this.props.positionB, 'blue');
  }

  componentDidMount() {
    this.canvas = this.refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.radius = this.canvas.height / 2;
    this.ctx.translate(this.radius, this.radius);
    this.radius *= 0.9;
    this.drawPlayerPosition();
  }

  componentDidUpdate() {
    this.drawPlayerPosition();
  }

  render() {
    return (
      <canvas id="gameCanvas" width="500" height="500" ref="canvas" />
    )
  }
}

RaceCanvas.propTypes = {
  positionA: React.PropTypes.number.isRequired,
  positionB: React.PropTypes.number.isRequired,
  distance: React.PropTypes.number.isRequired
};

export default RaceCanvas;
