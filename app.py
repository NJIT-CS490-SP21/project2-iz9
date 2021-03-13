import os
from flask import Flask, send_from_directory, json, session, jsonify
from flask_socketio import SocketIO, send
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())  # This is to load your env variables from .env

app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
#import models
#User=models.define_user_class(db)
#x=User(username ='wow')
#print(x)

import models
#User=models.define_user_class(db)
#x=User(username='username')
#print(x)  #<User 'username'>

i = 0
usersLogged = []
player1 = player2 = spectator = ""

#Flask socket IO documentation
cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(app,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)


@socketio.on('connect')
def on_connect():
    print('User connected!')
    #all_people = models.User.query.all()
    #users = []
    #for person in all_people:
    #    users.append(person.username)
    #print(users)
    #socketio.emit('user_list', {'users': users})


@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')


@socketio.on('board')
def on_board(
        data):  # data is whatever arg you pass in your emit call on client
    #print(str(data))
    socketio.emit('board', data, broadcast=True, include_self=False)


@socketio.on('reset')
def on_reset(data):
    socketio.emit('reset', data, broadcast=True, include_self=False)


@socketio.on('join')
def on_join(data):  # data is whatever arg you pass in your emit call on client
    print(str(data))  # prints {'username': 'name'}
    global i, usersLogged  #tracks users and appends when a user logs in
    global player1, player2, spectator
    i += 1
    usersLogged.append(data["username"])
    if len(usersLogged) == 1:
        player1 = data["username"]
        #print(str(data["username"]) + " is player 1")
    # print(str(usersLogged[0]) + " is player 1")
    elif len(usersLogged) == 2:
        player2 = data["username"]
        #print(str(data["username"]) + " is player 2")
        #print(str(usersLogged[1]) + " is player 2")
    else:
        spectator = data["username"]

    socketio.emit('join', usersLogged, broadcast=True, include_self=False)


@socketio.on("message")
def on_message(msg):
    print(msg)
    send(msg, broadcast=True)
    return None


@socketio.on('joinBoard')
def on_join_board(data):

    users, scores = DBdata()
    currentUsername = data['username']

    if currentUsername in users:
        print("This User exists {}".format(currentUsername))
    else:
        new_user = models.Users(username=data['username'],
                                score=100)  #{'username': 'name', 'score': 100}
        db.session.add(new_user)
        db.session.commit()
        users.append(currentUsername)
        socketio.emit('user_list', {'users': users, 'score': scores})


@socketio.on("updateScore")
def on_winner(data):

    winner = db.session.query(models.Users).get(data['winner'])
    winner.score = winner.score + 1
    db.session.commit()

    loser = db.session.query(models.Users).get(data['loser'])
    loser.score = loser.score - 1
    db.session.commit()

    users, scores = DBdata()
    socketio.emit('updateScore', {'users': users, 'score': scores})


@socketio.on("showBoardData")
def on_showBoardData():

    users, scores = DBdata()
    #print('Users from DB: {}'.format(users))
    #print('Scores from DB: {}'.format(scores))
    socketio.emit('showBoardData', {'users': users, 'score': scores})


def DBdata():
    users = []
    scores = []
    #all_people = models.Users.query.all()

    all_people = db.session.query(models.Users).order_by(
        models.Users.score.desc()).all()
    db.session.commit()

    for person in all_people:
        users.append(person.username)
        scores.append(person.score)
    return users, scores


if __name__ == "__main__":
    db.create_all()
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
