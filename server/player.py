import socket
from typing import overload
from server.card import cCard


class cPlayer:
    def __init__(self, name, idPlayer, pos=-1, balance=0):
        self.name = name
        self.idAvatar:int = -1
        self.idPlayer = idPlayer
        self.idPoolPlayer:int = -1
        self.posPool:int = -1
        self.pos = pos
        self.balance: float = balance
        self.cards: cCard = []
        self.active = False
        self.actedOnRound = False
        self.bet: float = 0
        self.evalMyHand: float = 0
        self.isMarkedToExit: bool = False
        self.betDifference: float = 0
        self.sock: socket
        self.totalBet: float = 0
        self.totalWinner: float = 0
        self.isNew: bool = True
        self.sitOut: bool = False
        self.waitForBlind: bool = True
        self.smallBlindPassedWhenSitOut: bool = False
        self.bigBlindPassedWhenSitOut: bool = True
        self.sitOutNextHand: bool = False
        self.sitOutNextBigBlind: bool = False
        self.amountToAdd: float = 0
        self.qtdHandsBigBlind: int = 99

    # @overload
    # def fSetCards(self, card1:cCard, card2:cCard):
    #     self.cards.append(cCard(card1))
    #     self.cards.append(cCard(card2))

    # @overload
    # def fSetCards(self, card1:cCard, card2:cCard, card3:cCard, card4:cCard):
    #     self.cards.append(cCard(card1))
    #     self.cards.append(cCard(card2))
    #     self.cards.append(cCard(card3))
    #     self.cards.append(cCard(card4))

    def isActive(self):
        return self.active

    def fSetActive(self):
        self.active = True
        # verificar depois se pode usar o active assim.
        # self.sitOut = False
        # self.sitOutNextHand = False
        # self.sitOutNextBigBlind = False

    def fSetInactive(self):
        self.active = False

    def fSetActedOnRound(self):
        self.actedOnRound = True

    def fSetNotActedOnRound(self):
        self.actedOnRound = False
