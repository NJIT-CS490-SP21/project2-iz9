import React from 'react';


function Square ({ value, onClick }) {
  return (
  <button class="squareBtn" onClick={onClick}>{value}</button>
  );
}

export default Square;
