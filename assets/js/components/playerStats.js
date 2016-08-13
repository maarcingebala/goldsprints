import React  from 'react';
import moment from 'moment';


class PlayerStats extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let style = { color: this.props.color }
    let raceTime = this.props.raceTime * 1000;
    let speedKmh = (this.props.speed * 3.6).toFixed();
    return (
      <div className={"race-stats " + this.props.className}>
        <p className="player-name" style={style}>{this.props.player}</p>
        <p>{speedKmh} km/h</p>
        <p>{moment.utc(raceTime).format('mm:ss.SSS')}</p>
        <p className={this.props.isWinner ? 'show' : 'hidden'}>WINNER!</p>
      </div>
    )
  }
}

PlayerStats.propTypes = {
  color: React.PropTypes.string,
  raceTime: React.PropTypes.number,
  position: React.PropTypes.number,
  speed: React.PropTypes.number,
  player: React.PropTypes.string.isRequired,
  isWinner: React.PropTypes.bool
};

export default PlayerStats;
