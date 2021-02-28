import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { calculateWinner } from './helpers';
import Board from './Board';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection io()

function Main () {
  //for board
  const [board, setBoard] = useState(Array(9).fill(null));
  //const [index, setIndex] = useState(0);
  const [xIsNext, setXisNext] = useState(true); //whose turn it is (have an event)
  const winner = calculateWinner(board);
  //const [xIsNext, setXisNext] = useState('X');
  
  //for login
  const [username, setUsername] = useState([]); //keeps track of users
  const inputRef = useRef(null);
  
  //for board showing
  const [isShown, setShown] = useState(false);
  
  //for updating board
  function squareClick(i) {
    //const timeInBoard = board.slice(0, index + 1);
    //const curr = timeInBoard[index];
    //const squares = [...curr];
    
    //if (winner || squares[i]) return;
    
    // X or O
    //squares[i] = 'X';
    //squares[i] = xIsNext;
    
    //squares[i] = xIsNext ? 'X' : 'O';
    //setBoard([...timeInBoard, squares]);
   // setIndex(timeInBoard.length);
   //setXisNext(!xIsNext);
    
    //var idx = squares.length;
    //while (idx-- && !squares[idx]);

    //console.log(idx);
    //console.log(squares[idx]); // prints the value

    const boardCopy = [...board];
  	// If user click an occupied square or if game is won, return
  	if (winner || boardCopy[i]) return;
  	// Put an X or an O in the clicked square
  	boardCopy[i] = xIsNext ? "X" : "O";
  	setBoard(boardCopy);
  	setXisNext(!xIsNext);
  	
  	
  	
  	
  	/*
  	let val = [...board];
  	if (val[i] === ""){
  	  if(xIsNext === 0){
  	    val[i] = "X";
  	    setXisNext(1);
  	    
  	  }
  	  else{
  	    val[i] = "O";
  	    setXisNext(0);
  	  }
  	  setBoard(val);
  	  socket.emit('board', { squares: val, isX: xIsNext })
  	}
    */

    socket.emit('board', { squares: boardCopy, isX: xIsNext });
    //socket.emit('board', { squares: val, isX: xIsNext });
    
    //have another socket for turn
    
   
  };
  
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
     
      setUsername(prevUsers => [...prevUsers, username]);
      socket.emit('join', { username: username });
    }
      
  };
  
  function onShowHide(){
    
  }
  
  const jumpTo = step => {
    //setIndex(step);
    setXisNext(step % 2 === 0);
  };
  
  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('board', (data) => {
      console.log('Board value event received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      
     
      setXisNext(!data.isX);
      setBoard((prevBoard) => [...data.squares]);
     
      
      /*
      setBoard((prevBoard) => [...data.val]);
      if(data.setXisNext === 1){
        setXisNext(0);
      }
      else{
        setXisNext(1);
      }
      */
      
      
    });
    
    socket.on('join', (data) => {
      console.log('User list received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setUsername(prevUserList => [...prevUserList, data]);
      
      //console.log('User logged in!');
     // console.log(data);
     // const lastItem = data[data.length - 1]
     // const player1 = data[0];
     // const player2 = data[1];
      //var i;
      //var spectators = "";
      //for (i = 3; i < data.length; i++) {
      //  spectators += data[i] + " ";
      //}
      
      //sends this to player 2
      //if (player1){
        //const timeInBoard = board.slice(0, index + 1);
        //const curr = timeInBoard[index];
        //const squares = [...curr];
        
        //if (winner || squares[i]) return;
        
        // X or O
        //squares[i] = 'X';
        //squares[i] = xIsNext;
        
        //squares[i] = xIsNext ? 'X' : 'O';
        //setBoard([...timeInBoard, squares]);
        //setIndex(timeInBoard.length);
      
        
        //console.log("i am player1")
        //xIsNext ='X';
        //setXisNext(xIsNext);
     // }
      //if (player2){
      //  const timeInBoard = board.slice(0, index + 1);
      //  const curr = timeInBoard[index];
      //  const squares = [...curr];
        
       // if (winner || squares[i]) return;
        
        // X or O
        //squares[i] = 'X';
        //squares[i] = xIsNext;
        
        
       // setBoard([...timeInBoard, squares]);
       // setIndex(timeInBoard.length);
        //setXisNext(false);
        //console.log("i am player2")
        //setXisNext(!xIsNext);
     // }
    
      //setUsername(prevUsers => [...prevUsers, lastItem]);
      //setXisNext();
      
      //console.log(player1);
      //squares[i] = xIsNext ? 'X' : 'O';
      //setXisNext(!xIsNext);
      
    }) ;
    
  
    
  }, []);
  
  
  
  return (
          <>
          <h1>Tic Tac Toe</h1>
          
          
          <div>
          Enter your username here: <input ref={inputRef} type="text" />
          <button onClick={() => {
                                    onLoginButton();
                                    onShowHide();
          }}>Log In</button>
          
            <div>
            <p>Logged in Users:</p>
            {username.map((item) => ( <li>{item}</li>))}
            </div>
            
          </div>
          
          {isShown === true ? (
            <div>
            <div><Board squares={board} onClick={squareClick} /> </div>
          
            <div>
            {winner ? 'Winner: ' + winner : 'Next Player: ' + (xIsNext ? 'X' : 'O')}
            
            </div></div> ) : ("Can't Show Board. You need to log in first!")}
          
          </>
  );
}

export default Main;