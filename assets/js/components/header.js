import React  from 'react';
import moment from 'moment';

import { COLOR_A, COLOR_B } from '../actions/types';


class RaceHeader extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let raceTime = this.props.raceTime * 1000;
    let styleA = { color: COLOR_A }
    let styleB = { color: COLOR_B }
    return (
      <div className="race__header">
        <h1 className="title">
          <span className="race__header__player" style={styleA}>{this.props.playerOne}</span>
          <span className="with-shadow"> vs. </span>
          <span className="race__header__player" style={styleB}>{this.props.playerTwo}</span>
        </h1>
        <h2 className="title with-shadow">{moment.utc(raceTime).format('mm:ss.SSS')}</h2>
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
