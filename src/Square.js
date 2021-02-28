import React from 'react';

const styles = {
  background: '#f1d8f0',
  border: '2px solid #e93576',
  cursor: 'pointer',
  outline: 'none',
  fontSize: '35px'
};

function Square ({ value, onClick }) {
  return (
  <button style={styles} onClick={onClick}>
    {value}
  </button>
  );
}

export default Square;
