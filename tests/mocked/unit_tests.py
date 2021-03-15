'''Mocked Unit Tests - 
1. Adding  a new username to database
2. Updating score on winner and loser in database
'''

import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
import models
from app import mock_on_winner, mock_order_by
from app import add_user
from app import DB
import models

KEY_INPUT = 'input'
KEY_EXPECTED = 'expected'
KEY_LENGTH = 'length'
KEY_FIRST_WORD = 'first_word'
KEY_SECOND_WORD = 'second_word'

INITIAL_USERNAME = 'user1'
FIRST_USERNAME = 'ivana'
SECOND_USERNAME = 'ana'
INITIAL_SCORE = 100


class AddUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [{
            KEY_INPUT: 'ivana',
            KEY_EXPECTED: [INITIAL_USERNAME, 'ivana'],
        }, {
            KEY_INPUT:
            'admin',
            KEY_EXPECTED: [INITIAL_USERNAME, 'ivana', 'admin'],
        }, {
            KEY_INPUT:
            'guest',
            KEY_EXPECTED: [INITIAL_USERNAME, 'ivana', 'admin', 'guest'],
        }]

        initial_person = models.Users(username=INITIAL_USERNAME, score=100)
        self.initial_db_mock = [initial_person]

    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)

    def mocked_db_session_commit(self):
        pass

    def mocked_person_query_all(self):
        return self.initial_db_mock

    def test_success(self):
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit',
                           self.mocked_db_session_commit):
                    with patch('models.Users.query') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all

                        print(self.initial_db_mock)
                        actual_result = add_user(test[KEY_INPUT])
                        print(actual_result)
                        expected_result = test[KEY_EXPECTED]
                        #print(self.initial_db_mock)
                        #print(expected_result)

                        self.assertEqual(len(actual_result),
                                         len(expected_result))
                        self.assertEqual(actual_result[1], expected_result[1])


#print(mock_on_winner('y','k'))
# { winner: player1, loser: player2 }
class OnWinnerTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: ['user1', 'user2'],
                KEY_EXPECTED: [100, 100],
            },
            {
                KEY_INPUT: ['user1', 'user2'],
                KEY_EXPECTED: [101, 99],
            },
            {
                KEY_INPUT: ['user1', 'user2'],
                KEY_EXPECTED: [102, 98],
            },
            {
                KEY_INPUT: ['user1', 'user2'],
                KEY_EXPECTED: [99, 101],
            },
        ]

        winner = models.Users(username='user1', score=100)
        loser = models.Users(username='user2', score=100)
        self.initial_db_mock = [winner, loser]

        print(self.initial_db_mock)
        print(winner.score)

    def mocked_query_get(self, first_player):
        return self.initial_db_mock(models.Users).get(first_player)

    def mocked_winner_score(self, winner):
        return winner.score + 1

    def mocked_db_session_commit(self):
        pass

    def test_split_success(self):
        for test in self.success_test_params:
            first_player = test[KEY_INPUT][0]
            second_player = test[KEY_INPUT][1]
            with patch('app.DB.session.query') as mocked_query:
                mocked_query.get = self.mocked_query_get
                #with patch('winner.score + 1', self.mocked_winner_score):
                #with patch('app.DB.session.commit', self.mocked_db_session_commit):

                actual_result = mock_on_winner(first_player, second_player)
                expected_result = test[KEY_EXPECTED]

                #print(actual_result)
                self.assertEqual(len(actual_result), len(expected_result))


'''
class OrderByTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: [models.Users.score.desc()],
                KEY_EXPECTED: [INITIAL_USERNAME, 'ivana'],
            },
        ]
        
        initial_person = models.Users(username=INITIAL_USERNAME, score=100)
        self.initial_db_mock = [initial_person]
    
    def mocked_db_session_query(self):
        return self.initial_db_mock
   
    def mocked_query_order_by(self, score_arg):
        print("order by", score_arg)
        # with patch('models.Users.score.desc', self.mocked_query_order_by())
    
    def mocked_person_query_all(self):
        return self.initial_db_mock    
        
    def test_success(self):
        for test in self.success_test_params:
            with patch('app.DB.session.query') as mocked_query:
                mocked_query.order_by = self.mocked_query_order_by
                mocked_query.all = self.mocked_person_query_all
               
                        
                #print(self.initial_db_mock)
                actual_result = mock_order_by(test[KEY_INPUT])
                #print(actual_result)
                expected_result = test[KEY_EXPECTED]
                #print(self.initial_db_mock)
                #print(expected_result)
                
                self.assertEqual(len(actual_result), len(expected_result))
                self.assertEqual(actual_result[1], expected_result[1])
    
'''

if __name__ == "__main__":
    unittest.main()
