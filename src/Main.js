import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { calculateWinner } from './helpers';
import Board from './Board';
import './Main.css';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection io()

function Main () {
  //for board
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true); 
  const winner = calculateWinner(board);
  
  //for login
  const [username, setUsername] = useState([]); //keeps track of users
  const inputRef = useRef(null);
  
  //for board showing
  const [isShown, setShown] = useState(false);
  const [thisUser, setThisUser] = useState();
  
  let player1 = username[0];
  let player2 = username[1];
 
  //for updating board
  function squareClick(i) {
    
    const boardCopy = [...board];
  	if (winner || boardCopy[i] ) return;
  	
  	console.log("---------------------");
  	console.log(username);
  	console.log(xIsNext);
  	console.log(player1);
  	console.log(board);
  	console.log("---------------------");
  	
  	//player 1 
  	if (xIsNext && player1 == thisUser) {
  	  //console.log("Does it go here????");
  	  boardCopy[i] = 'X';
  	  setBoard(boardCopy);
  	  setXisNext(!xIsNext); 
  	  socket.emit('board', { squares: boardCopy, isX: xIsNext }); 
  	}
  	//player 2 
  	else if (!xIsNext && player2 == thisUser){
  	  //console.log("How ab here");
  	  boardCopy[i] = 'O';
  	  setBoard(boardCopy);
  	  setXisNext(!xIsNext); 
  	  socket.emit('board', { squares: boardCopy, isX: xIsNext });
  	}
  };
  
  //username of logged users
  function onLoginButton() {
    const username = inputRef.current.value;
    if (username == ""){
      alert("Please enter your username!");
      return;
    }
    else if (username != null) {
      setShown((prevShown) => {
         return !prevShown;
    });
    
    setThisUser(username); //uniquely identifies browser with username
    setUsername(prevUsers => [...prevUsers, username]); //set the user list
    socket.emit('join', { username: username }); //emit the user to server
    document.getElementById("logBtn").disabled = true; //button can be clicked only once
    }
  };
  
  //restart button 
  function restartButton(){
    setBoard(Array(9).fill(null));
    socket.emit('reset', Array(9).fill(null)); //emits an empty board
    document.getElementById("ResetButton");
  }
 
  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for an event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('board', (data) => {
      console.log('Board value event received!');
      console.log(data);
      
      setXisNext(!data.isX);
      setBoard((prevBoard) => [...data.squares]);
    });
    
    
    socket.on('reset', (data) => {
      setBoard(prev => data);
    })
    
    
    socket.on('join', (data) => {
      console.log('User list received!');
      console.log(data);

      const lastItem = data[data.length - 1]
      setUsername(prevUsers => [...prevUsers, lastItem]);
    });

  }, []);
  
  
  const boardIsFull = board.every(element => element !== null);
  console.log(boardIsFull); //true if board is full
  
  return (
          <>
          <h1>Tic Tac Toe</h1>
          
          <div>
          <div class="centerInput">
          Enter your username: <input ref={inputRef} type="text" />
          <button class="logBtn" id="logBtn" onClick={() => {
                                    onLoginButton();
          }}>Log In</button>
          </div>
          
          <div>
            
          {isShown === true ? (
          <div>
          <div><Board squares={board} onClick={squareClick} /> </div>
    
          <div class="playerStyle">
          {winner ? 'Winner: ' + winner : 'Next Player: ' + (xIsNext ? 'X' : 'O')}
          </div></div> ) : (<p class="txt">Can't Show Board. You need to log in first!</p>)}
          
          <div class="centerPlayers">
          { ( (winner == "X")) ? (
          <p>Winner User: {username[0]} </p>) : ("")}
          
          { ( (winner == "O")) ? (
          <p>Winner Username: {username[1]} </p>) : ("")}
          
          { ( (winner != "X" || winner != "O") && boardIsFull) ? (
          <p>Draw Game!</p>) : ("")}
          </div>
          
          { ( (winner == "X" || winner == "O") && (thisUser ==  username[0] || thisUser ==  username[1]) ) ||
          ( (winner != "X" || winner != "O") && (thisUser == username[0] || thisUser == username[1]) && boardIsFull)  ? (
            <div class="restartBtnCenter"><button class="restartBtn" onClick={()=>restartButton()}>Restart</button></div>
          ) : ("")}
          
          <div class="centerPlayers">
          <div class="playerDisplay"><p>Player X: <br /> {username[0]}</p></div>
          <div class="playerDisplay"><p>Player O: <br /> {username[1]}</p></div>
          <div class="playerDisplay"><p>Spectators: <br /> { username.slice(2).join(", ") }</p></div>
          </div>
          
          </div>
          </div>
          </>
  );
}

export default Main;