import React from 'react';
import Square from './Square';
import './Main.css';

function Board ({ squares, onClick }) {
    
  return (
  <div class="boardStyle">
    {squares.map((square, i) => (
      <Square key={i} value={square} onClick={() => onClick(i)} />
    ))}
  </div>
);
}

export default Board;
