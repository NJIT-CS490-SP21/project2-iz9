'''
Unmocked Unit Tests - 
1. Appending a username to list
2. Winner score increased by 1 and Loser score decreased by 1
'''
import unittest
import os
import sys

sys.path.append(os.path.abspath('../../'))
import models
from app import user_append, unmock_winner_loser

KEY_INPUT = 'input'
KEY_EXPECTED = 'expected'


class UsersAppendTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [{
            KEY_INPUT: 'User1',
            KEY_EXPECTED: ['User1'],
        }, {
            KEY_INPUT: 'User2',
            KEY_EXPECTED: ['User2'],
        }, {
            KEY_INPUT: 'User3',
            KEY_EXPECTED: ['User3'],
        }]

        self.failure_test_params = [{
            KEY_INPUT: 'User',
            KEY_EXPECTED: 'User',
        }, {
            KEY_INPUT: 'User',
            KEY_EXPECTED: ['Userss', 'User', ''],
        }, {
            KEY_INPUT: 'User',
            KEY_EXPECTED: ['Users', 'User'],
        }]

    def test_user_append_success(self):
        for test in self.success_test_params:

            actual_result = user_append((test[KEY_INPUT]))
            #print(actual_result)
            expected_result = test[KEY_EXPECTED]

            self.assertEqual(len(actual_result), len(expected_result))
            self.assertEqual(actual_result[0], expected_result[0])

    def test_user_append_failure(self):
        for test in self.failure_test_params:

            actual_result = user_append((test[KEY_INPUT]))
            expected_result = test[KEY_EXPECTED]

            self.assertNotEqual(len(actual_result), len(expected_result))
            self.assertNotEqual(actual_result[0], expected_result[0])


class WinnerLoserScoreTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [{
            KEY_INPUT: [100, 100],
            KEY_EXPECTED: [101, 99],
        }, {
            KEY_INPUT: [101, 99],
            KEY_EXPECTED: [102, 98],
        }, {
            KEY_INPUT: [99, 101],
            KEY_EXPECTED: [100, 100],
        }]

        self.failure_test_params = [{
            KEY_INPUT: [100, 100],
            KEY_EXPECTED: [300, 400, 109],
        }, {
            KEY_INPUT: [101, 99],
            KEY_EXPECTED: [99, 101, ''],
        }, {
            KEY_INPUT: [50, 60],
            KEY_EXPECTED: [61, 49, ''],
        }]

    def test_winner_loser_score_success(self):
        for test in self.success_test_params:

            actual_result = unmock_winner_loser((test[KEY_INPUT]))
            #print(actual_result)
            expected_result = test[KEY_EXPECTED]

            self.assertEqual(len(actual_result), len(expected_result))
            self.assertEqual(actual_result[0], expected_result[0])

    def test_winner_loser_score_failure(self):
        for test in self.failure_test_params:

            actual_result = unmock_winner_loser((test[KEY_INPUT]))
            expected_result = test[KEY_EXPECTED]

            self.assertNotEqual(len(actual_result), len(expected_result))
            self.assertNotEqual(actual_result[0], expected_result[0])


if __name__ == "__main__":
    unittest.main()
