import React  from 'react';
import moment from 'moment';


class RaceHeader extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let raceTime = this.props.raceTime * 1000;
    return (
      <div className="race__header">
        <p className="title is-1 with-shadow">{this.props.playerOne} vs. {this.props.playerTwo}</p>
        <p className="title is-2 with-shadow">{moment.utc(raceTime).format('mm:ss.SSS')}</p>
      </div>
    )
  }
}

RaceHeader.propTypes = {
  raceTime: React.PropTypes.number.isRequired,
  playerOne: React.PropTypes.string.isRequired,
  playerTwo: React.PropTypes.string.isRequired
};

export default RaceHeader;
