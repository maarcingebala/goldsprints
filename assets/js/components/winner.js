import React from 'react';

const { Component, PropTypes } = React;

export default class Winner extends Component {
    render() {
        const { winner: { name, color, time } } = this.props;
        const style = color ? {color: color} : {};
        return (
            <div className="winner">
                {name ? (
                    <div>
                        <p>Wygrał</p>
                        <h1 style={style}>{name}</h1>
                        <h2>{time}</h2>
                    </div>
                ) :  (
                    <div>
                        <h1>Remis</h1>
                        <h2>{time}</h2>
                    </div>
                )}
            </div>
        );
    }
}
