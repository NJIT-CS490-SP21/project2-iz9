import React from 'react';
import PropTypes from 'prop-types';
import './Main.css';

function ListItem({ name }) {
  return <tr>{name}</tr>;
}
ListItem.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ListItem;
