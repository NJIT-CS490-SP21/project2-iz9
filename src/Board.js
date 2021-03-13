import React from 'react';
import PropTypes from 'prop-types';
import Square from './Square';
import './Main.css';

function Board({ squares, onClick }) {
  return (
    <div className="boardStyle">
      {squares.map((square, i) => (
        <Square key={i} value={square} onClick={() => onClick(i)} />
      ))}
    </div>
  );
}
Board.propTypes = {
  squares: PropTypes.string.isRequired,
  onClick: PropTypes.string.isRequired,
};

export default Board;
