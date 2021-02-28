import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
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

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('board')
def on_chat(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('board',  data, broadcast=True, include_self=False)


@socketio.on('join')
def on_join(data): # data is whatever arg you pass in your emit call on client
    #print(str(data["username"])) #ivana
    print(str(data)) # prints {'username': 'ivana'}
    global i, usersLogged #tracks users and appends when a user logs in
    global player1,player2,spectator
    i+=1
    usersLogged.append(data["username"])
    #print(len(usersLogged))
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
        #print(str(data["username"]) + " is spectator")
        print(str(usersLogged[3]) + " is spectator")
    
    #send back data from server to client telling the users what role they are, based on that decide who can make a move or not
    #client needs to know what player they are
    # track this on server he knows all users, assign player type here and broadcast to clients
    
   # for usersLogged in data["username"]: #we have to iterate through the object username and access the usernames
    # then increment count, if count is 1 player 1, if count 2 player O, else watchers
  #      i+=1
    #    print(usersLogged)
    
 
    # This emits the event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('join', usersLogged, broadcast=True, include_self=False)
    #socketio.emit('join', data, player1,player2,spectator, broadcast=True, include_self=False)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)