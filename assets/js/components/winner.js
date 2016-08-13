import React from 'react';

const { Component, PropTypes } = React;

export default class Winner extends Component {
    render() {
        const { winner } = this.props;
        let style = { color: winner.color };
        return (
            <div className="winner">
                <p>Wygrał</p>
                <h1 style={style}>{ winner.name }</h1>
            </div>
        );
    }
} 