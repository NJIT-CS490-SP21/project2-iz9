import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { calculateWinner } from './helpers';
import { ListItem } from './ListItem';
import Board from './Board';
import './Main.css';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection io()

const Main = () => {
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
  
  //for chat
  const [messages, setMessages] = useState([""]);
  const [message, setMessage] = useState("");
  
  //for leaderboard
  const [isLeadShown, setLeadShown] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]); //state to update table when user logs
  const [leaderScore, setScore] = useState([]); //state to update scores
  
  //to keep sending messages 
  useEffect(() => {
    getMessages();
  }, [messages.length]);
  
  //onchange event occurs when the value of an element has been changed
  const onChange = c => {
    setMessage(c.target.value);
  };
  
  //when send button is clicked
  const onSendButton = () => {
    if (message !== "") {
      socket.emit("message", message);
      //setThisUser(username);
      setMessage("");
      //console.log("The username is " + username);
      //console.log("The message from this user is " + message);
    } else {
      alert("Type in your message!");
    }
  };
  
  const getMessages = () => {
    socket.on("message", msg => {
      //updates messages state
      setMessages([...messages, msg]);
    });
  };
  
  let player1 = username[0];
  let player2 = username[1];
 
  //for updating board
  const squareClick = i => {
    
    const boardCopy = [...board];
  	if (winner || boardCopy[i] ) return;
  	
  	//console.log("---------------------");
  	//console.log(username);
  	//console.log(xIsNext);
  	//console.log(player1);
  	//console.log(board);
  	//console.log("---------------------");
  	
  	//player 1 
  	if (xIsNext && player1 === thisUser) {
  	  //console.log("Does it go here????");
  	  boardCopy[i] = 'X';
  	  setBoard(boardCopy);
  	  setXisNext(!xIsNext); 
  	  socket.emit('board', { squares: boardCopy, isX: xIsNext }); 
  	}
  	//player 2 
  	else if (!xIsNext && player2 === thisUser){
  	  //console.log("How ab here");
  	  boardCopy[i] = 'O';
  	  setBoard(boardCopy);
  	  setXisNext(!xIsNext); 
  	  socket.emit('board', { squares: boardCopy, isX: xIsNext });
  	}
  
  };
  
  //username of logged users
  const onLoginButton = () => {
    const username = inputRef.current.value;
    if (username === ""){
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
    //document.getElementById("restartBtn").remove();
    //new event for leaderboard
    socket.emit('joinBoard',  { username: username });
    }
  };
  
  /*
  // button
  var element = document.getElementById('LeaderboardBtn'); // grab a reference to your element
  if(element){
    element.addEventListener('click', clickHandler);
  }
  
  var elementIsClicked = false; // declare the variable that tracks the state
  function clickHandler(){ // declare a function that updates the state
  console.log('inside handleclick');
    elementIsClicked = true;
    //winner_loser();
  }
  */


  const restartButton = () => {
    //  elementIsClicked = true;
    setBoard(Array(9).fill(null));
    socket.emit('reset', Array(9).fill(null)); //emits an empty board
    document.getElementById("restartBtn");
  }
  
  function thereIsWinner(){
    if (winner === "X" || winner === "O"){
      return true;
    }
  }
  
  function thereisNoWinner(){
    if (winner !== "X" || winner !== "O"){
      return true;
    }
  }
  
  function thereIsUser(){
    if (thisUser ===  username[0] || thisUser ===  username[1]) {
      if(thisUser ===  username[0]){
        //let status = "Winner: " + username[0]; 
        //console.log("I am player 1");
      }
      else if (thisUser === username[1]){
        //let status = "Winner: " + username[1];
      }
      return true;
    }
  }
 
 //means game ends
  function BoardFull(){
    if (board.every(element => element !== null)) {
      //socket.emit('game_ends', { username: username }); // and if won/lost/draw
      return true;
    }
  }

  function showRestartButton(){
    if ( (thereIsWinner() && thereIsUser() ) || ( thereisNoWinner() && thereIsUser() && BoardFull() ) ){
      //socket.emit('game_ends');
      return true;
      //console.log("Show the button");
    }
  }


  
  
  const LeaderboardBtn = () => {
    socket.emit('showBoardData');
    setLeadShown((prevShown) => {
       return !prevShown;
    });
  }
  
  const UpdateLeaderboardBtn = () => {
    winner_loser();
    socket.emit('showBoardData');
  }
  

  
  
  useEffect(() => {
    
    socket.on('board', (data) => {
      //console.log('Board value event received!');
      //console.log(data);
      setXisNext(!data.isX);
      setBoard((prevBoard) => [...data.squares]);
    });
    
    
    socket.on('reset', (data) => {
      setBoard(prev => data);
    })
    
    
    socket.on('join', (data) => {
      //console.log('User list received!');
      //console.log(data);

      const lastItem = data[data.length - 1]
      setUsername(prevUsers => [...prevUsers, lastItem]);
    });
    
    //sends object key username and value array of names
    //key score and value array of scores
    //this prints twice too problem
    socket.on('user_list', (data) => {
      console.log('User list received!');
      console.log(data);
      
      setLeaderboardData(data.users); //array of users
      setScore(data.score); //array of scores
    });
    
   
    
    socket.on('showBoardData', (data) => {
     
      setLeaderboardData(data.users); //array of users
      setScore(data.score); //array of scores
    
    });


  }, []);
  

  return (
    <>
    <div class="full">
    
      <div class="left"> {messages.length > 0 && messages.map(msg => (
        <div class="msgDiv">
          <p class="msg">{msg}</p>
        </div>
      ))}
          
      <input class="chatInput" value={message} name="message" onChange={c => onChange(c)} />
      <button class="chatBtn"onClick={() => onSendButton()}>Send</button>
      </div>
          
      <div lass="right">
        <h1>Tic Tac Toe</h1>
        <div>
          <div class="centerInput"> Enter your username: <input ref={inputRef} type="text" />
          <button class="logBtn" id="logBtn" onClick={() => {onLoginButton();}}>Log In</button>
          </div>
      
          <div>
            {isShown === true ? (
            <div>
            <div><Board squares={board} onClick={squareClick} /> </div>
    
            <div class="playerStyle">
            {winner ? 'Winner: ' + winner : 'Next Player: ' + (xIsNext ? 'X' : 'O')}
            </div></div> ) : (<p class="txt">Can't Show Board. You need to log in first!</p>)}
          
            <div class="centerPlayers">
            { ( (winner === "X")) ? (
            <p>Winner User: {username[0]} </p>) : ("")}
          
            { ( (winner === "O")) ? (
            <p>Winner Username: {username[1]} </p>) : ("")}
            
            { thereisNoWinner() && BoardFull() ? (
            <p>Draw Game!</p>) : ("")}
            </div>
            
            { showRestartButton() ? (
            <div class="restartBtnCenter"><button id="restartBtn" class="restartBtn" onClick={()=>restartButton()}>Restart</button></div>
            ) : (null) }
            

            <div class="centerPlayers">
              <div class="playerDisplay"><p>Player X: <br /> {username[0]}</p></div>
              <div class="playerDisplay"><p>Player O: <br /> {username[1]}</p></div>
              <div class="playerDisplay"><p>Spectators: <br /> { username.slice(2).join(", ") }</p></div>
            </div>
          
          </div>
        </div>
        
        <div class="leaderTable">
        <button class="LeaderboardBtn" id="LeaderboardBtn" onClick={() => {LeaderboardBtn();}}>View Leaderboard</button>
        <button class="UpdateLeaderboardBtn" id="UpdateLeaderboardBtn" onClick={() => {UpdateLeaderboardBtn();}}>Update Score</button>
        <p>If you are a winner, please update your score by clicking the button!</p>
        </div>
      
        {isLeadShown === true ? (
            <div class="leaderTable">
            
            <table>
            <thead>
                <tr>
                    <th colSpan="2">Leadership Board</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Username</td> 
                    <td>Score</td>
                </tr>
                <tr>
                    <td>{leaderboardData.map((user, index) => <ListItem key={index} name={user} />)} </td>
                    <td>{leaderScore.map((newScore, index) => <ListItem key={index} name={newScore} />)} </td>
                </tr>
            </tbody>
            </table>
            </div> ) : (null)}
            
            
          
    
      </div>
    </div>
  </>
  );
}

export default Main;