import React  from 'react';
import moment from 'moment';


class PlayerStats extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let style = { color: this.props.color }
    let raceTime = this.props.raceTime * 1000;
    return (
      <div className={"race-stats " + this.props.className}>
        <p style={style}>{this.props.player}: {this.props.position} : {moment.utc(raceTime).format('mm:ss.SSS')}</p>
        <p className={this.props.isWinner ? 'show' : 'hidden'}>WINNER!</p>
      </div>
    )
  }
}

PlayerStats.propTypes = {
  color: React.PropTypes.string,
  raceTime: React.PropTypes.number,
  position: React.PropTypes.number,
  player: React.PropTypes.string.isRequired,
  isWinner: React.PropTypes.bool
};

export default PlayerStats;
