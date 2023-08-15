import subprocess
import shlex
from server.card import cCard

POKER_EVAL_FILE = 'server/pokerstove/ps-eval'
class cEval:
    @staticmethod
    def fEvaluateTexasHand(hand:str, board:str):
        shellCommand = POKER_EVAL_FILE + ' ' + hand + ' -b ' + board
        output = subprocess.run(shlex.split(shellCommand),stdout=subprocess.PIPE)
        res = str(output.stdout)[2:-3].split("\\n")
        res = [r.split(' ')[4] for r in res]
        return res

    @staticmethod 
    def fEvaluateOmahaHand(hand:str, board:str):
        shellCommand = POKER_EVAL_FILE + ' ' + hand + ' -g O -b ' + board
        output = subprocess.run(shlex.split(shellCommand),stdout=subprocess.PIPE)
        res = str(output.stdout)[2:-3].split("\\n")
        res = [r.split(' ')[4] for r in res]
        return res