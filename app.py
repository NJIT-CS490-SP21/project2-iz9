import os
from flask import Flask, send_from_directory, json, session, jsonify
from flask_socketio import SocketIO, send
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

i=0;
usersLogged=[]
player1=player2=spectator=""

#Flask socket IO documentation
cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

# When a client emits the event 'board' to the server, this function is run
# 'board' is a custom event name that we just decided
@socketio.on('board')
def on_board(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'board' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('board',  data, broadcast=True, include_self=False)

@socketio.on('reset')
def on_reset(data):
    print(str(data)) 
    socketio.emit('reset',  data, broadcast=True, include_self=False)

@socketio.on('join')
def on_join(data): # data is whatever arg you pass in your emit call on client
    print(str(data)) # prints {'username': 'name'}
    global i, usersLogged #tracks users and appends when a user logs in
    global player1,player2,spectator
    i+=1
    usersLogged.append(data["username"])
    if (len(usersLogged) == 1):
        player1 = data["username"]
        #print(str(data["username"]) + " is player 1")
        print(str(usersLogged[0]) + " is player 1")
    elif (len(usersLogged) == 2):
        player2 = data["username"]
        #print(str(data["username"]) + " is player 2")
        print(str(usersLogged[1]) + " is player 2")
    else:
        spectator = data["username"]
        
    socketio.emit('join', usersLogged, broadcast=True, include_self=False)
    
@socketio.on("message")
def on_message(msg):
    print(msg)
    send(msg, broadcast=True)
    return None

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)