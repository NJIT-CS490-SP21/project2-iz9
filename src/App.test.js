import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getQueriesForElement } from '@testing-library/dom';
import App from './App';

/* eslint-env jest */
test('Leaderboard shows when button clicked', () => {
  render(<App />);
  const ViewLeaderboardElement = screen.getByText('View Leaderboard');

  // shows when button clicked
  fireEvent.click(ViewLeaderboardElement);
  const UsernameShows = screen.getByText('Username');
  const ScoreShows = screen.getByText('Score');
  expect(UsernameShows).toBeInTheDocument();
  expect(ScoreShows).toBeInTheDocument();

  // doesn't show when button toggeled
  fireEvent.click(ViewLeaderboardElement);
  expect(UsernameShows).not.toBeInTheDocument();
  expect(ScoreShows).not.toBeInTheDocument();
});

/* eslint-env browser */
test('Header shows right content', () => {
  const root = document.createElement('div');
  ReactDOM.render(<App />, root);
  const { getByText } = getQueriesForElement(root);

  expect(root.querySelector('h1').textContent).toBe('Tic Tac Toe');
  expect(getByText('Tic Tac Toe')).not.toBeNull();
});
