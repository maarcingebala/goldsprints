import React from 'react';

const { Component, PropTypes } = React;

export default class Winner extends Component {
    render() {
        const { winner } = this.props;
        console.log(winner);
        let style = winner ? {color: winner.color} : {};
        return (
            <div className="winner">
                {winner ? 
                    (<div><p>Wygrał</p><h1 style={style}>{ winner.name }</h1></div>) : 
                    (<div><h1>Remis</h1></div>)}
            </div>
        );
    }
}
