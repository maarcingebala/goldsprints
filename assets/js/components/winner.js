import React from 'react';

const { Component, PropTypes } = React;

export default class Winner extends Component {
    render() {
        const { winner } = this.props;
        return (
            <div className="winner">
                <p>Wygrał</p>
                <h1>{winner}</h1>
            </div>
        );
    }
} 