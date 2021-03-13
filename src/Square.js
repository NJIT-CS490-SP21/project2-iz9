import React from 'react';
import PropTypes from 'prop-types';

function Square({ value, onClick }) {
  return (
    <button type="button" className="squareBtn" onClick={onClick}>
      {value}
    </button>
  );
}
Square.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.string.isRequired,
};
export default Square;
