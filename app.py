'''Server'''
import os
from flask import Flask, send_from_directory, json, session, jsonify
from flask_socketio import SocketIO, send
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import models

load_dotenv(find_dotenv())  # This is to load your env variables from .env

APP = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)

i = 0
USERS_LOGGED = []
PLAYER1 = PLAYER2 = SPECTATOR = ""

#Flask socket IO documentation
CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    '''return index'''
    return send_from_directory('./build', filename)


@SOCKETIO.on('connect')
def on_connect():
    '''when server spots a user connection'''
    print('User connected!')
    #all_people = models.User.query.all()
    #users = []
    #for person in all_people:
    #    users.append(person.username)
    #print(users)
    #socketio.emit('user_list', {'users': users})

@SOCKETIO.on('disconnect')
def on_disconnect():
    '''when server spots a user disconnection'''
    print('User disconnected!')


@SOCKETIO.on('board')
def on_board(
        data):  # data is whatever arg you pass in your emit call on client
    '''when server listens to board data'''
    #print(str(data))
    SOCKETIO.emit('board', data, broadcast=True, include_self=False)


@SOCKETIO.on('reset')
def on_reset(data):
    '''when server listens to reset event from client'''
    SOCKETIO.emit('reset', data, broadcast=True, include_self=False)


@SOCKETIO.on('join')
def on_join(data):  # data is whatever arg you pass in your emit call on client
    '''when server listens to join event from client'''
    print(str(data))  # prints {'username': 'name'}
    global i, USERS_LOGGED  #tracks users and appends when a user logs in
    global PLAYER1, PLAYER2, SPECTATOR
    i += 1
    USERS_LOGGED.append(data["username"])
    if len(USERS_LOGGED) == 1:
        PLAYER1 = data["username"]
        #print(str(data["username"]) + " is player 1")
    # print(str(usersLogged[0]) + " is player 1")
    elif len(USERS_LOGGED) == 2:
        PLAYER2 = data["username"]
        #print(str(data["username"]) + " is player 2")
        #print(str(usersLogged[1]) + " is player 2")
    else:
        SPECTATOR = data["username"]

    SOCKETIO.emit('join', USERS_LOGGED, broadcast=True, include_self=False)


@SOCKETIO.on("message")
def on_message(msg):
    '''when server listens to message event from client'''
    print(msg)
    send(msg, broadcast=True)
    return None


@SOCKETIO.on('joinBoard')
def on_join_board(data):
    '''when server listens to users joining event from client'''

    users, scores = db_data()
    current_username = data['username']

    if current_username in users:
        print("This User exists {}".format(current_username))
    else:
        new_user = models.Users(username=data['username'],
                                score=100)  #{'username': 'name', 'score': 100}
        DB.session.add(new_user)
        DB.session.commit()
        users.append(current_username)
        SOCKETIO.emit('user_list', {'users': users, 'score': scores})


@SOCKETIO.on("updateScore")
def on_winner(data):
    '''when server listens to updateScore event from client'''

    winner = DB.session.query(models.Users).get(data['winner'])
    winner.score = winner.score + 1
    DB.session.commit()

    loser = DB.session.query(models.Users).get(data['loser'])
    loser.score = loser.score - 1
    DB.session.commit()

    users, scores = db_data()
    SOCKETIO.emit('updateScore', {'users': users, 'score': scores})


@SOCKETIO.on("showBoardData")
def on_show_board_data():
    '''when server listens to showBoardData event from client'''

    users, scores = db_data()
    #print('Users from DB: {}'.format(users))
    #print('Scores from DB: {}'.format(scores))
    SOCKETIO.emit('showBoardData', {'users': users, 'score': scores})


def db_data():
    '''function for database info'''
    users = []
    scores = []
    #all_people = models.Users.query.all()

    all_people = DB.session.query(models.Users).order_by(
        models.Users.score.desc()).all()
    DB.session.commit()

    for person in all_people:
        users.append(person.username)
        scores.append(person.score)
    return users, scores


if __name__ == "__main__":
    DB.create_all()
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
