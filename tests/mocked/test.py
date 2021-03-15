import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
import models
from app import mock_on_winner, SOCKETIO
from app import add_user
from app import DB
import models
def socketio_test():
    # log the user in through Flask test client
    flask_test_client = app.test_client()

    # connect to Socket.IO without being logged in
    socketio_test_client = socketio.test_client(
        app, flask_test_client=flask_test_client)

    # make sure the server rejected the connection
    assert not socketio_test_client.is_connected()

    # log in via HTTP
    r = flask_test_client.post('/login', data={
        'username': 'python', 'password': 'is-great!'})
    assert r.status_code == 200

    # connect to Socket.IO again, but now as a logged in user
    socketio_test_client = socketio.test_client(
        app, flask_test_client=flask_test_client)

    # make sure the server accepted the connection
    r = socketio_test_client.get_received()
    assert len(r) == 1
    assert r[0]['name'] == 'welcome'
    assert len(r[0]['args']) == 1
    assert r[0]['args'][0] == {'username': 'python'}


if __name__ == '__main__':
    socketio_test()