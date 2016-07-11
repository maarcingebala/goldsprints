var React = require('react');

class Stats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      speed: 0,
      raceTime: 0
    }
  }

  render() {
    var speed = this.props.speed * 3.6;
    return (
      <p>position: {this.props.position.toFixed(2)} m,
        speed: {speed.toFixed(2)} km/h,
        raceTime: {this.props.raceTime.toFixed(2)} s</p>
    );
  }

}

export default Stats;
