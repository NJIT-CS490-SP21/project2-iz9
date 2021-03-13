import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import calculateWinner from './helpers';
import ListItem from './ListItem';
import Board from './Board';
import './Main.css';

const socket = io(); // Connects to socket connection io()

const Main = () => {
  // for board
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true);
  const winner = calculateWinner(board);

  // for login
  const [username, setUsername] = useState([]); // keeps track of users
  const inputRef = useRef(null);

  // for board showing
  const [isShown, setShown] = useState(false);
  const [thisUser, setThisUser] = useState();

  // for chat
  const [messages, setMessages] = useState(['']);
  const [message, setMessage] = useState('');

  // for leaderboard
  const [isLeadShown, setLeadShown] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]); // state to update table when user log
  const [leaderScore, setScore] = useState([]); // state to update scores

  // onchange event occurs when the value of an element has been changed
  const onChange = (c) => {
    setMessage(c.target.value);
  };

  // when send button is clicked
  const onSendButton = () => {
    if (message !== '') {
      socket.emit('message', message);
      // setThisUser(username);
      setMessage('');
      // console.log("The username is " + username);
      // console.log("The message from this user is " + message);
    } else {
      alert('Type in your message!');
    }
  };

  const getMessages = () => {
    socket.on('message', (msg) => {
      // updates messages state
      setMessages([...messages, msg]);
    });
  };

  // to keep sending messages
  useEffect(() => {
    getMessages();
  }, [getMessages, messages.length]);

  const player1 = username[0];
  const player2 = username[1];

  // for updating board
  const squareClick = (i) => {
    const boardCopy = [...board];
    if (winner || boardCopy[i]) return;

    // console.log("---------------------");
    // console.log(username);
    // console.log(xIsNext);
    // console.log(player1);
    // console.log(board);
    // console.log("---------------------");

    // player 1
    if (xIsNext && player1 === thisUser) {
      boardCopy[i] = 'X';
      setBoard(boardCopy);
      setXisNext(!xIsNext);
      socket.emit('board', { squares: boardCopy, isX: xIsNext });
    } else if (!xIsNext && player2 === thisUser) {
      // console.log("How ab here");
      boardCopy[i] = 'O';
      setBoard(boardCopy);
      setXisNext(!xIsNext);
      socket.emit('board', { squares: boardCopy, isX: xIsNext });
    }
  };

  // username of logged users
  const onLoginButton = () => {
    const username = inputRef.current.value;
    if (username === '') {
      alert('Please enter your username!');
    } else if (username != null) {
      setShown((prevShown) => !prevShown);

      setThisUser(username); // uniquely identifies browser with username
      setUsername((prevUsers) => [...prevUsers, username]); // set the user list
      socket.emit('join', { username }); // emit the user to server
      document.getElementById('logBtn').disabled = true; // button can be clicked only once
      // document.getElementById("restartBtn").remove();
      // new event for leaderboard
      socket.emit('joinBoard', { username });
    }
  };

  const restartButton = () => {
    //  elementIsClicked = true;
    setBoard(Array(9).fill(null));
    socket.emit('reset', Array(9).fill(null)); // emits an empty board
    document.getElementById('restartBtn');
  };

  function thereIsWinner() {
    if (winner === 'X' || winner === 'O') {
      return true;
    }
    return false;
  }

  function thereisNoWinner() {
    if (winner !== 'X' || winner !== 'O') {
      return true;
    }
    return false;
  }

  function thereIsUser() {
    if (thisUser === username[0] || thisUser === username[1]) {
      if (thisUser === username[0]) {
        // let status = "Winner: " + username[0];
        // console.log("I am player 1");
      } else if (thisUser === username[1]) {
        // let status = "Winner: " + username[1];
      }
      return true;
    }
    return false;
  }

  // means game ends
  function BoardFull() {
    if (board.every((element) => element !== null)) {
      return true;
    }
  }

  function showRestartButton() {
    if (
      (thereIsWinner() && thereIsUser())
      || (thereisNoWinner() && thereIsUser() && BoardFull())
    ) {
      return true;
      // console.log("Show the button");
    }
    return false;
  }

  /*
  function ifGameEnds(){
    if (thereIsWinner() || BoardFull() ) {
      console.log("inside game ends");
      socket.emit('game_ends');
    }
  }
  ifGameEnds();
  */
  function winnerLoser() {
    if (winner === 'X' && player1 === thisUser) {
      socket.emit('updateScore', { winner: player1, loser: player2 });
    } else if (winner === 'O' && player2 === thisUser) {
      socket.emit('updateScore', { winner: player2, loser: player1 });
    }
  }

  const LeaderboardBtn = () => {
    socket.emit('showBoardData');
    setLeadShown((prevShown) => !prevShown);
  };

  const UpdateLeaderboardBtn = () => {
    winnerLoser();
    socket.emit('showBoardData');
  };

  useEffect(() => {
    socket.on('board', (data) => {
      // console.log('Board value event received!');
      // console.log(data);
      setXisNext(!data.isX);
      // setBoard((prevBoard) => [...data.squares]);
      setBoard([...data.squares]);
    });

    socket.on('reset', (data) => {
      // setBoard((prev) => data);
      setBoard(data);
    });

    socket.on('join', (data) => {
      // console.log('User list received!');
      // console.log(data);
      const lastItem = data[data.length - 1];
      setUsername((prevUsers) => [...prevUsers, lastItem]);
    });

    // sends object key username and value array of names
    // key score and value array of scores
    socket.on('user_list', (data) => {
      console.log('User list received!');
      console.log(data);

      setLeaderboardData(data.users); // array of users
      setScore(data.score); // array of scores
    });

    socket.on('updateScore', (data) => {
      // console.log(data.score + " SCOREEEEEE");
      setLeaderboardData(data.users); // array of users
      setScore(data.score); // array of scores
    });

    socket.on('showBoardData', (data) => {
      setLeaderboardData(data.users); // array of users
      setScore(data.score); // array of scores
    });
  }, []);

  return (
    <>
      <div className="full">
        <div className="left">
          <h3>Chat App</h3>
          {messages.length > 0
          && messages.map((msg) => (
            <div className="msgDiv">
              <p className="msg">{msg}</p>
            </div>
          ))}

          <input
            className="chatInput"
            value={message}
            name="message"
            onChange={(c) => onChange(c)}
          />
          <button
            type="button"
            className="chatBtn"
            onClick={() => onSendButton()}
          >
            Send
          </button>
        </div>

        <div lass="right">
          <h1>Tic Tac Toe</h1>
          <div>
            <div className="centerInput">
              {' '}
              Enter your username:
              <input ref={inputRef} type="text" />
              <button
                className="logBtn"
                type="button"
                id="logBtn"
                onClick={() => {
                  onLoginButton();
                }}
              >
                Log In
              </button>
            </div>

            <div>
              {isShown === true ? (
                <div>
                  <div>
                    <Board squares={board} onClick={squareClick} />
                    {' '}
                  </div>

                  <div className="playerStyle">
                    {winner
                      ? `Winner: ${winner}`
                      : `Next Player: ${xIsNext ? 'X' : 'O'}`}
                  </div>
                </div>
              ) : (
                <p className="txt">
                  Can&apos;t Show Board. You need to log in first!
                </p>
              )}

              <div className="centerPlayers">
                {winner === 'X' ? (
                  <p>
                    Winner User:
                    {username[0]}
                  </p>
                ) : (
                  ''
                )}

                {winner === 'O' ? (
                  <p>
                    Winner Username:
                    {username[1]}
                  </p>
                ) : (
                  ''
                )}

                {thereisNoWinner() && BoardFull() ? <p>Draw Game!</p> : ''}
              </div>

              {showRestartButton() ? (
                <div className="restartBtnCenter">
                  <button
                    id="restartBtn"
                    type="button"
                    className="restartBtn"
                    onClick={() => restartButton()}
                  >
                    Restart
                  </button>
                </div>
              ) : null}

              <div className="centerPlayers">
                <div className="playerDisplay">
                  <p>
                    Player X:
                    <br />
                    {username[0]}
                  </p>
                </div>
                <div className="playerDisplay">
                  <p>
                    Player O:
                    <br />
                    {username[1]}
                  </p>
                </div>
                <div className="playerDisplay">
                  <p>
                    Spectators:
                    <br />
                    {username.slice(2).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="leaderTable">
            <button
              className="LeaderboardBtn"
              type="button"
              id="LeaderboardBtn"
              onClick={() => {
                LeaderboardBtn();
              }}
            >
              View Leaderboard
            </button>
            <button
              className="UpdateLeaderboardBtn"
              type="button"
              id="UpdateLeaderboardBtn"
              onClick={() => {
                UpdateLeaderboardBtn();
              }}
            >
              Update Score
            </button>
            <p>
              If you are a winner, please update your score by clicking the
              button when game ends!
            </p>
          </div>

          {isLeadShown === true ? (
            <div className="leaderTable">
              <table>
                <thead>
                  <tr>
                    <th colSpan="2">Leaderboard</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Username</td>
                    <td>Score</td>
                  </tr>
                  <tr>
                    <td>
                      {leaderboardData.map((user, index) => (
                        <ListItem key={index} name={user} />
                      ))}
                      {' '}
                    </td>
                    <td>
                      {leaderScore.map((newScore, index) => (
                        <ListItem key={index} name={newScore} />
                      ))}
                      {' '}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Main;
