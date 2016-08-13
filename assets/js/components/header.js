import React  from 'react';
import moment from 'moment';

import { COLOR_A, COLOR_B } from '../actions/types';


class RaceHeader extends React.Component {
  render() {
    let { raceTime, playerOne, playerTwo, showRaceTime } = this.props;
    let styleA = { color: COLOR_A }
    let styleB = { color: COLOR_B }
    raceTime = raceTime ? raceTime * 1000 : 0;
    return (
      <div className="race__header">
        <h1 className="title">
          <span className="race__header__player" style={styleA}>{playerOne}</span>
          <span className="with-shadow"> vs. </span>
          <span className="race__header__player" style={styleB}>{playerTwo}</span>
        </h1>
        {showRaceTime ? (<h2 className="title with-shadow">{moment.utc(raceTime).format('mm:ss.SSS')}</h2>) : (null)}
      </div>
    )
  }
}

RaceHeader.propTypes = {
  raceTime: React.PropTypes.number,
  playerOne: React.PropTypes.string.isRequired,
  playerTwo: React.PropTypes.string.isRequired
};

export default RaceHeader;
