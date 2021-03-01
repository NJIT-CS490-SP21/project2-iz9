import React from 'react';
import './Main.css';

function Square ({ value, onClick }) {
  return (
  <button class="squareBtn" onClick={onClick}>
    {value}
  </button>
  );
}

export default Square;
