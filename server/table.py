import time
import random
from typing import List
from server.deck import cDeck
from server.card import cCard
from server.player import cPlayer
from server.evaluate import cEval
from server.enumerates import eGameTypes, eBetLimits
from server.connection import cConnection
from server.logger import cLogger
from threading import Thread
import threading
from copy import copy

logger = cLogger("table")


class thTimer(Thread):
    """
        The timer thread class. it receives the table object as a parameter to act over it. \n
        It starts a thread that runs over an array of timers, use setTimer() to insert a timer into the array
    """

    def __init__(self, table):
        self.table = table
        self.timers = []
        self.stopThread = False
        Thread.__init__(self)
        self.start()

    def run(self):
        logger.fPrintAndLog(
            "IdTable: " + str(self.table.tableId) + " Timer started", logMethod="DEBUG")
        initialTime = time.time()
        interval = 1
        lastTime = 0
        while True:
            # wait for actions and count the timer.
            time.sleep(0.5)
            logger.fPrintAndLog("IdTable: " + str(self.table.tableId) +
                                " timers: %s" % self.timers, logMethod="DEBUG")
            for timer in self.timers:
                elapsedTime = time.time() - timer['startTimer']
                self.table.elapsedTime = elapsedTime
                logger.fPrintAndLog("IdTable: " + str(self.table.tableId) + " Time to act: %s Elapsed time: %s" % (
                    timer['timeToAct'], elapsedTime), logMethod="DEBUG")
                # if elapsedTime - interval >= lastTime:
                #     # log the elapsed time with 1 second of interval.
                #     lastTime = elapsedTime
                if timer['timeToAct'] <= (elapsedTime):
                    # time to act is over.
                    logger.fPrintAndLog("IdTable: " + str(self.table.tableId) + 
                        "Time to act is over for position %s" % self.table.positionToAct, logMethod="DEBUG")
                    if timer["action"] == "BUY":
                        # Time is over to Rebuy
                        for pos in self.table.playersAskedToRebuy:
                            self.table.players[pos].sitOut = True
                            self.table.playersAskedToRebuy.remove(pos)
                            # self.fSendToSock(
                            #     self.table.players[pos].sock, "SIT_OUT;%s#" % pos)
                    elif timer["action"] == "PLAYER_TURN":
                        # time is over on Player Turn
                        if "CHECK" in self.table.fCheckValidActions():
                            self.table.fCheck(self.table.positionToAct)
                        else:
                            self.table.fFold(self.table.positionToAct)
                if not self.table.handIsBeingPlayed and self.table.playersAskedToRebuy == []:
                    # self.table.fNewHand()
                    self.stop(-1)
            if self.stopThread:  # termina a thread quando encerra a mesa.
                break

    def stop(self, pos):
        """
            Takes the timer for the actual position out of the array
        """
        logger.fPrintAndLog("IdTable: " + str(self.table.tableId) +
                            " Stop Timer thread", logMethod="DEBUG")
        self.timers = [i for i in self.timers if not (i['pos'] == pos)]

    def setTimer(self, pos, timeToAct, action="PLAYER_TURN"):
        """
            Inserts a timer for the position on the array.
        """
        startTimer = time.time()
        self.timers.append({"pos": pos, "timeToAct": timeToAct,
                            "startTimer": startTimer, "action": action})


class cTable:
    def __init__(self, tableId: int, gameType: eGameTypes, betLimit: eBetLimits, maxPlayers, smallBlind, bigBlind, isTournament=False, ante=0, timeToAct=20, minBuyIn=0, maxBuyIn=9999999, pool=None):
        self.tableId: int = tableId
        self.gameType = gameType
        self.betLimit = betLimit
        self.maxPlayers = maxPlayers
        self.smallBlind: float = smallBlind
        self.bigBlind: float = bigBlind
        self.ante: float = ante
        self.minBuyIn: float = minBuyIn
        self.maxBuyIn: float = maxBuyIn
        self.currentNumPlayersOnTable = 0
        self.dealer: int = -1
        self.deck = cDeck()
        self.board: cCard = []
        self.players: cPlayer = []
        for _ in range(0, maxPlayers):
            self.players.append(None)
        self.playersOnHand: cPlayer = []
        self.positionToAct: int = 0
        self.round: int = 0
        self.pots: float = []
        self.actTimeTest: int = 1
        self.socks = []
        self.conn = cConnection(False)
        self.timeToAct = timeToAct
        self.playersAllinOnHand: int = 0
        self.countTest = 0
        self.minBet: float = 0
        self.maxBet: float = 0
        self.amountToCall: float = 0
        self.handNumber: int = 0
        self.handIsBeingPlayed: bool = False
        self.isTournament: bool = isTournament
        self.playersAskedToRebuy = []
        self.timer = thTimer(self)
        self.pool = pool
        self.emptySeats = []
        self.fAppendEmptySeats()
        self.createTime = time.time()
        self.mtxCheckActions = threading.Lock()
        self.mtxAddPlayer = threading.Lock()
        self.mtxAddPlayer.acquire()
        self.elapsedTime = 0
        
    def fSendToAll(self, message: str):
        ''' Envia mensagem para todos os Sockets '''
        for s in self.socks:
            if(not self.conn.fSend(s, message)):
                logger.fPrintAndLog("IdTable: " + str(self.tableId) + " Erro no envio de mensagem ao socket: Sock " + str(s) + " Message " + message)
                for p in self.players:
                    if p is not None and p.sock is not None and p.sock == s:
                        p.isMarkedToExit = True

    def fSendToOthers(self, sock, message: str):
        ''' Envia mensagem para todos os Sockets MENOS para o Socket '''
        for s in self.socks:
            if(s != sock):
                if(not self.conn.fSend(s, message)):
                    logger.fPrintAndLog("IdTable: " + str(self.tableId) + " Erro no envio de mensagem ao socket: Sock " + str(s) + " Message " + message)
                    for p in self.players:
                        if p is not None and p.sock is not None and p.sock == s:
                            p.isMarkedToExit = True

    def fSendToSock(self, sock, message: str):
        ''' Envia mensagem para socket '''
        if(sock is not None):
            if(not self.conn.fSend(sock, message)):
                logger.fPrintAndLog("IdTable: " + str(self.tableId) + " Erro no envio de mensagem ao socket: Sock " + str(sock) + " Message " + message)
                for p in self.players:
                    if p is not None and p.sock is not None and p.sock == sock:
                        p.isMarkedToExit = True

    def fCountActivePlayers(self):
        ''' Retorna quantidade de jogadores ativos '''
        count: int = 0
        for p in self.players:
            if (p is not None):
                if (p.balance > 0 and not p.sitOut):
                    count += 1
        return count

    def fAppendEmptySeats(self):
        ''' cria a lista com lugares vagos na mesa '''
        for p in range(len(self.players)):
            if (self.players[p] is None):
                self.emptySeats.append(p)
        return

    def fCountSeatedPlayers(self):
        ''' Retorna quantidade de jogadores ativos '''
        count: int = 0
        for p in self.players:
            if (p is not None):
                count += 1
        return count

    def fCountSeatedAndBetPlayers(self):
        ''' Retorna quantidade de jogadores que sentaram na mesa e fizeram ao menos 1 aposta '''
        count: int = 0
        for p in self.players:
            if (p is not None):
                if (p.totalBet>0):
                    count += 1
        return count

    def fGetPotsString(self):
        ''' Monta string com todos os Pots para envio '''
        s = ""
        for i in range(0, len(self.pots)):
            s += "UPDATE_POT_AMOUNT;" + \
                str(i) + ";" + str(round(self.pots[i], 2)) + "#"
        return s

    def fSendTable(self, sock=None, position=-1):
        """
            Envia as informações da mesa ao iniciar uma nova conexão
        """
        if sock == None:
            self.fSendToAll("SEND_TABLE;ok#")
            for p in self.players:
                if p is not None:
                    self.fSendToAll("RESERVE_SIT;" +
                                    str(p.pos) + ";" + str(p.name) + ";" + str(p.idAvatar) + "#")
                    if (p.balance > 0):
                        self.fSendToAll("SIT;" + str(p.pos) +
                                        ";" + str(p.balance) + "#")
                        self.fSendToAll("UPDATE_PLAYER_BET;" +
                                        str(p.pos) + ";" + str(round(p.bet, 2)) + "#")
                        if len(p.cards) > 0:
                            if(p.pos == position):
                                if self.gameType == eGameTypes.Texas:
                                    self.fSendToAll("PLAYER_CARD;" + str(p.pos) + ";" + str(
                                        p.cards[0].fGetCard()) + str(p.cards[1].fGetCard()) + "#")
                                elif self.gameType == eGameTypes.Omaha:
                                    self.fSendToAll("PLAYER_CARD;" + str(p.pos) + ";" + str(p.cards[0].fGetCard()) + str(
                                        p.cards[1].fGetCard()) + str(p.cards[2].fGetCard()) + str(p.cards[3].fGetCard()) + "#")
                            else:
                                self.fSendToAll(
                                    "PLAYER_CARD;" + str(p.pos) + "#")
            if(self.fCountActivePlayers() > 1):
                self.fSendToAll("UPDATE_DEALER;" + str(self.dealer) + "#")
                self.fSendTableCards(addCardsOnBoard=False)
                self.fSendToAll(self.fGetPotsString())

        else:
            for p in self.players:
                if not p is None:
                    self.fSendToSock(sock, "SEND_TABLE;ok#")
                    self.fSendToSock(sock, "RESERVE_SIT;" +
                                     str(p.pos) + ";" + str(p.name) + "#")
                    if (p.balance > 0):
                        self.fSendToSock(sock, "SIT;" + str(p.pos) +
                                         ";" + str(p.balance) + "#")
                        self.fSendToSock(sock, "UPDATE_PLAYER_BET;" +
                                         str(p.pos) + ";" + str(round(p.bet, 2)) + "#")
                        if len(p.cards) > 0:
                            if(p.pos == position):
                                if self.gameType == eGameTypes.Texas:
                                    self.fSendToSock(sock, "PLAYER_CARD;" + str(p.pos) + ";" + str(
                                        p.cards[0].fGetCard()) + str(p.cards[1].fGetCard()) + "#")
                                elif self.gameType == eGameTypes.Omaha:
                                    self.fSendToSock(sock, "PLAYER_CARD;" + str(p.pos) + ";" + str(p.cards[0].fGetCard()) + str(
                                        p.cards[1].fGetCard()) + str(p.cards[2].fGetCard()) + str(p.cards[3].fGetCard()) + "#")
                            else:
                                self.fSendToSock(
                                    sock, "PLAYER_CARD;" + str(p.pos) + "#")
            if(self.fCountActivePlayers() > 1):
                self.fSendToSock(sock, "UPDATE_DEALER;" +
                                 str(self.dealer) + "#")
                self.fSendTableCards(sock, False)
                self.fSendToSock(sock, self.fGetPotsString())

    def fSendCards(self, pos):
        '''
        Distribui as cartas e envia para todos os Jogadores
        pos = posição do Dealer da Rodada, ele começa a distribuir para o proximo jogador
        '''
        numCards = 0
        posDeck = 0
        if self.gameType == eGameTypes.Texas:
            numCards = 2
        if self.gameType == eGameTypes.Omaha:
            numCards = 4
        for _ in range(numCards):
            for i in range(self.maxPlayers):
                p = pos + i
                if p >= self.maxPlayers:
                    p -= self.maxPlayers
                if self.players[p] is not None and (self.players[p].balance + self.players[p].bet > 0) and self.players[p] in self.playersOnHand:
                    self.players[p].cards.append(
                        cCard(self.deck.fGetCard(posDeck)))
                    posDeck += 1
        for p in self.players:
            if p is not None and p.balance + p.bet > 0 and p in self.playersOnHand:
                if self.gameType == eGameTypes.Texas:
                    self.fSendToSock(p.sock, "PLAYER_CARD;" + str(p.pos) + ";" +
                                     str(p.cards[0].fGetCard()) + str(p.cards[1].fGetCard()) + "#")
                elif self.gameType == eGameTypes.Omaha:
                    self.fSendToSock(p.sock, "PLAYER_CARD;" + str(p.pos) + ";" + str(p.cards[0].fGetCard()) + str(
                        p.cards[1].fGetCard()) + str(p.cards[2].fGetCard()) + str(p.cards[3].fGetCard()) + "#")
                self.fSendToOthers(p.sock, "PLAYER_CARD;" + str(p.pos) + "#")
        return True

    def fCancelSitOutNext(self, pos: int):
        self.players[pos].sitOutNextBigBlind = False
        self.players[pos].sitOutNextHand = False

    def fSitOutNextHand(self, pos: int):
        self.fCancelSitOutNext(pos)
        self.players[pos].sitOutNextBigBlind = False
        self.players[pos].sitOutNextHand = True

    def fSitOutNextBlind(self, pos: int):
        self.fCancelSitOutNext(pos)
        self.players[pos].sitOutNextBigBlind = True
        self.players[pos].sitOutNextHand = False

    def fWaitBigBlind(self, pos: int, activate: bool):
        self.players[pos].sitOutNextBigBlind = False
        self.players[pos].sitOutNextHand = False
        self.players[pos].waitForBlind = activate
        if activate:
            self.fSendToSock(self.players[pos].sock, "WAIT_BIG_BLIND;1#")
        else:
            self.fSendToSock(self.players[pos].sock, "WAIT_BIG_BLIND;0#")
        if(not self.handIsBeingPlayed):
            self.fNewHand()

    def fGetHighestBet(self):
        ''' Retorna Maior aposta da rodada '''
        bet: float = 0
        for p in self.players:
            if not p is None:
                if (p.bet > bet):
                    bet = p.bet
        return bet

    def fGetNumPlayersWithHighestBet(self, maxBet):
        ''' Retorna Quantidade de jogadores com a aposta maxima. '''
        qtde: int = 0
        for p in self.players:
            if not p is None:
                if (p.bet == maxBet):
                    qtde += 1
        return qtde

    def fGetHighestPossibleTotalBet(self):
        """
            Returns a float with the value of highest possible total bet.\n
            That is: the biggest (totalBet + balance)
        """
        totalBet: float = 0
        for p in self.players:
            if p is not None:
                if (p.bet + p.balance > totalBet):
                    totalBet = p.bet + p.balance
        return totalBet

    def fGetSecondHighestBet(self, maxBet: float):
        bet: float = 0
        for p in self.players:
            if p is not None:
                if (p.bet > bet and p.bet < maxBet):
                    bet = p.bet
        return bet

    def fGetAllBets(self):
        bet: float = 0
        for p in self.players:
            if not p is None:
                bet += p.bet
        return bet

    def fGetPrevPos(self, pos: int, hasCards: bool = True, hasBet: bool = False):
        ''' Pega a posição anterior a posição enviada '''
        for i in range(1, self.maxPlayers):
            p = pos - i
            if p < 0:
                p += self.maxPlayers
            if (not self.players[p] is None):
                if(hasCards):
                    if(len(self.players[p].cards) > 0):
                        return p
                elif hasBet:
                    if(self.players[p].bet > 0):
                        return p
                else:
                    return p
        return -1

    def fGetNextPos(self, pos: int, hasCards: bool = True, hasBet: bool = False, hasBalance: bool = False, isBigBlind: bool = False, isDealer: bool = False, isSmallBlind: bool = False):
        ''' Pega a posição seguinte a posição enviada '''
        for i in range(1, self.maxPlayers):
            p = pos + i
            if p >= self.maxPlayers:
                p -= self.maxPlayers
            if (self.players[p] is not None):
                if hasCards:
                    if(len(self.players[p].cards) > 0):
                        return p
                elif hasBet:
                    if(self.players[p].bet > 0 and not self.players[p].sitOut):
                        return p
                elif hasBalance:
                    if(self.players[p].balance > 0 and not self.players[p].sitOut):
                        return p
                elif isSmallBlind:
                    # não tem por que validar back NextHand ou back NextBBling aqui.
                    # if(self.players[p].balance > 0 and not self.players[p].isNew and not self.players[p].backNextHand and not self.players[p].backNextBigBlind):
                    if(self.players[p].sitOut):
                        self.players[p].smallBlindPassedWhenSitOut = True
                    if(self.players[p].balance > 0 and not self.players[p].sitOut):
                        return p
                elif isDealer:
                    if(self.players[p].balance > 0 and not self.players[p].sitOut):
                        return p
                elif isBigBlind:
                    logger.fPrintAndLog("IdTable: " + str(self.tableId) + " fGetNextPos: IsBigBlind p: %s blnc: %s sitOut: %s" % (
                        p, self.players[p].balance, self.players[p].sitOut), logMethod="DEBUG")
                    if(self.players[p].sitOut or self.players[p].balance == 0):
                        self.players[p].sitOut = True
                        self.players[p].bigBlindPassedWhenSitOut = True
                    # if(self.players[p].sitOutNextHand or self.players[p].sitOutNextBigBlind):
                    #     self.players[p].sitOut = True
                    #     self.players[p].sitOutNextHand = True
                    #     self.players[p].sitOutNextBigBlind = False
                    #     self.players[p].bigBlindPassedWhenSitOut = True
                    if(self.players[p].sitOut and self.players[p].balance > 0 and not self.players[p].sitOutNextHand):
                        self.players[p].isNew = False
                        self.players[p].sitOut = False
                        self.players[p].sitOutNextHand = False
                        self.players[p].sitOutNextBigBlind = False
                        self.players[p].bigBlindPassedWhenSitOut = False
                        return p
                    if(self.players[p].isNew and self.players[p].balance > 0):
                        self.players[p].isNew = False
                        self.players[p].sitOut = False
                        self.players[p].sitOutNextHand = False
                        self.players[p].sitOutNextBigBlind = False
                        self.players[p].bigBlindPassedWhenSitOut = False
                        return p
                    if(not self.players[p].isNew and not self.players[p].sitOut and self.players[p].balance > 0):
                        self.players[p].isNew = False
                        self.players[p].sitOut = False
                        self.players[p].sitOutNextHand = False
                        self.players[p].sitOutNextBigBlind = False
                        self.players[p].bigBlindPassedWhenSitOut = False
                        return p
                else:
                    return p
        return -1

    def fVerifyAllPlayersActed(self):
        ''' Verifica se todos os jogadores já agiram '''
        for p in self.players:
            if p is not None:
                # validando se foi all-in considera como se tivesse agido.
                if (len(p.cards) > 0 and (p.actedOnRound == False)):
                    if(p.balance != 0):
                        return False
        return True

    def fVerifyAllPlayersWithSameBet(self, higtBet: float):
        """
            Verify if all players have the same bet amount.
            Returns a Boolean:\n
                True if everyone have the same bet.\n
                False Otherwise.
        """
        for p in self.playersOnHand:
            if p is not None:
                # If a player bets more than the others can call, it is allin too.
                if (len(p.cards) > 0):
                    if (p.bet == higtBet and len(self.playersOnHand)-1 <= self.playersAllinOnHand):
                        next
                    elif (p.bet != higtBet):
                        if (p.balance == 0):
                            next
                        else:
                            return False
        return True

    def fPlaceBlind(self, pos: int, blind: float):
        """
            Place the given Blind amount to the given position.
        """
        if(self.players[pos].balance <= blind):
            blind = self.players[pos].balance
            self.playersAllinOnHand += 1
        self.players[pos].bet = blind
        self.players[pos].balance -= blind
        # ainda nao sei se essa mensagem é necessaria ou se vai usar para alguma coisa
        # self.fSendToAll("BLIND;#")
        self.fSendToAll("UPDATE_PLAYER_STACK;" + str(pos) +
                        ";" + str(round(self.players[pos].balance, 2)) + "#")
        self.fSendToAll("UPDATE_PLAYER_BET;" + str(pos) + ";" +
                        str(round(self.players[pos].bet, 2)) + "#")

    def fPlaceAntes(self, pos: int = -1, ante: float = 0):
        """
            Place the Ante amount to the pot. \n
            If its called without receiving any parameters, it will place the Ante amount for everyone. \n
            If its called receiving the position parameters, it will place the Ante amount only for the given position.
        """
        if ante == 0:
            ante = self.ante
        # ainda nao sei se essa mensagem é necessaria ou se vai usar para alguma coisa
        # self.fSendToAll("ANTE;#")
        logger.fPrintAndLog(
            "IdTable: " + str(self.tableId) + " Ante", logMethod="DEBUG")
        if pos == -1:
            for p in self.players:
                if p is not None:
                    if(p.balance <= ante):
                        ante = p.balance
                        self.playersAllinOnHand += 1
                    p.balance -= ante
                    self.pots[0] += ante
                    self.fSendToAll("UPDATE_PLAYER_STACK;" + str(pos) +
                                    ";" + str(round(self.players[pos].balance, 2)) + "#")
                    self.fSendToAll(
                        "UPDATE_PLAYER_BET;" + str(self.pots[0]) + ";" + str(round(ante, 2)) + "#")
                    time.sleep(1)
            self.fSendToAll(self.fGetPotsString())
        else:
            if(self.players[pos].balance < ante):
                ante = self.players[pos].balance
            self.players[pos].balance -= ante
            self.pots[0] += ante
            self.fSendToAll("UPDATE_PLAYER_STACK;" + str(pos) +
                            ";" + str(round(self.players[pos].balance, 2)) + "#")
            self.fSendToAll(self.fGetPotsString())

    def fMaxHandEval(self):
        ''' Calcula o valor de todas as mãos '''
        maxHandEval: float = 0
        handsCards: str = ''
        boardCards: str = ''
        retEval = []
        for p in self.players:
            if p is not None:
                p.evalMyHand = 0
        for b in self.board:
            boardCards += b.fGetCard()
        for p in self.playersOnHand:
            for c in p.cards:
                handsCards += c.fGetCard()
            handsCards += ' '
        if self.gameType == eGameTypes.Omaha:
            retEval = cEval.fEvaluateOmahaHand(handsCards, boardCards)
        if self.gameType == eGameTypes.Texas:
            retEval = cEval.fEvaluateTexasHand(handsCards, boardCards)
        for i in range(len(retEval)):
            if float(retEval[i]) > maxHandEval:
                maxHandEval = float(retEval[i])
            self.players[self.playersOnHand[i].pos].evalMyHand = float(
                retEval[i])
        return maxHandEval

    def fNumOfPlayersWinners(self, maxHandEval: float):
        ''' Retorna numero de jogadores vencedores '''
        count: int = 0
        for p in self.players:
            if not p is None:
                if len(p.cards) > 0 and p.evalMyHand == maxHandEval:
                    count += 1
        return count

    def fSomeoneHaveCards(self):
        ''' Retornar True se alguem tiver cartas, false se ninguem tiver cartas. '''
        count: int = 0
        for p in self.players:
            if p is not None:
                if len(p.cards) > 0:
                    logger.fPrintAndLog("IdTable: " + str(self.tableId) + " Encontrou jogador com cartas", logMethod="DEBUG")
                    return True
        logger.fPrintAndLog("IdTable: " + str(self.tableId) + " Nao encontrou nenhum jogador com cartas", logMethod="DEBUG")
        return False

    def fAskPlayersToRebuy(self):
        ''' Envia mensagem aos jogadores perguntando se querem fazer rebuy. '''
        logger.fPrintAndLog(
            "IdTable: " + str(self.tableId) + " Perguntando aos jogadores se querem fazer Rebuy", logMethod="DEBUG")
        self.playersAskedToRebuy = []
        for p in self.players:
            if p is not None:
                if(p.balance == 0 and not p.isNew and not p.sitOut):
                    # Get Values for min and max Player balance
                    self.playersAskedToRebuy.append(p.pos)
                    self.fSendToSock(p.sock, "REQUEST_BUY;" + str(p.pos) +
                                     ";" + str(self.minBuyIn) + ";" + str(self.maxBuyIn) + "#")
                    self.fSendToOthers(
                        p.sock, "REQUEST_BUY;" + str(p.pos) + "#")
        return (self.playersAskedToRebuy != [])

    def fPlayerWantsToRebuy(self, pos: int):
        ''' Envia mensagem ao jogador informando o valor que ele pode fazer adicionar às fichas dele. '''
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " Um Jogador quer fazer rebuy", logMethod="DEBUG")
        # Get Values for min and max Player balance
        stack = self.players[pos].balance
        if stack > self.minBuyIn:
            minBuy = 0
        else:
            minBuy = self.minBuyIn - stack
        if stack > self.maxBuyIn:
            maxBuy = 0
        else:
            maxBuy = self.maxBuyIn - stack
        self.fSendToSock(self.players[pos].sock, "REQUEST_BUY;" +
                         str(pos) + ";" + str(minBuy) + ";" + str(maxBuy) + "#")
        self.fSendToOthers(
            self.players[pos].sock, "REQUEST_BUY;" + str(pos) + "#")
    
    def fVerifyWinner(self):
        ''' Verifica os ganhadores '''
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " Verificando Ganhador", logMethod="DEBUG")
        # Verifica o(s) vencedor(es) e paga ele(s) = (atualiza balance)
        if (len(self.playersOnHand) == 1):
            logger.fPrintAndLog(self.playersOnHand)
            for p in self.players:
                if p is not None:
                    if p.pos == self.playersOnHand[0].pos:
                        p.balance += self.fGetTotalPots()
                        p.totalWinner += self.fGetTotalPots()
                        logger.fPrintAndLog(
                            "IdTable: " + str(self.tableId) + " returning Verificando Ganhador", logMethod="DEBUG")
                        #self.fSendToAll("UPDATE_PLAYER_STACK;" + str(p.pos) + ";" + str(round(p.balance, 2)) + "#")
                        #self.fSendToAll("UPDATE_PLAYER_BET;" + str(p.pos) + ";" + str(round(p.bet, 2)) + "#")
                        # self.fGetBackToPool(p)
                        #return
        else:
            # analisando quando tem mais de um jogador disputando os potes
            maxHandEval: float = self.fMaxHandEval()
            numOfWinners: int = self.fNumOfPlayersWinners(maxHandEval)
            if maxHandEval != 100:
                logger.fPrintAndLog(
                    "IdTable: " + str(self.tableId) + " Empate", logMethod="DEBUG")
            logger.fPrintAndLog("IdTable: " + str(self.tableId) + " Number of winners: " +
                                str(numOfWinners), logMethod="DEBUG")
            minTotalBetWinner: float = -1
            # percorre todos os jogadores e atualiza o valor do menor total bet dentre os ganhadores.
            for p in self.players:
                if not p is None:
                    if p.evalMyHand == maxHandEval:
                        if(minTotalBetWinner == -1 or p.totalBet < minTotalBetWinner):
                            minTotalBetWinner = p.totalBet
            # percorre todos os jogadores atualizando o totalBet deles.
            logger.fPrintAndLog("IdTable: " + str(self.tableId) + " MinTotalBetWinner = " +
                                str(minTotalBetWinner), logMethod="DEBUG")

            for p in self.players:
                if p is not None:
                    if p.totalBet > 0:
                        totalBetToSub: float = 0
                        if(p.totalBet > minTotalBetWinner):
                            totalBetToSub = minTotalBetWinner
                        else:
                            totalBetToSub = p.totalBet
                            if(len(p.cards) > 1):
                                p.cards = []
                                self.playersOnHand.remove(p)
                        logger.fPrintAndLog("IdTable: " + str(self.tableId) + 
                            " PlayerPos " + str(p.pos) + " totalBetToSub = " + str(totalBetToSub), logMethod="DEBUG")
                        # Subtrai dos potes o valor a ser pago para o ganhador.
                        self.fSubFromPot(totalBetToSub)
                        p.totalBet -= totalBetToSub
                        # percorre todos os jogadores adicionando aos vencedores o seu pot
                        for p1 in self.players:
                            if not p1 is None:
                                if p1.evalMyHand == maxHandEval:
                                    logger.fPrintAndLog("IdTable: " + str(self.tableId) + " PlayerPos " + str(p1.pos) + " Aumentando Balance em " + str(
                                        totalBetToSub/numOfWinners), logMethod="DEBUG")
                                    p1.balance += totalBetToSub/numOfWinners
                                    p1.totalWinner += totalBetToSub/numOfWinners
            if(self.fCountSeatedAndBetPlayers() > 1):
                self.fVerifyWinner()
                logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                                    " returning Verificando Ganhador", logMethod="DEBUG")
                return
        # creating the Winners string
        winnersString = ""
        for p in self.players:
            if p is not None and p.totalWinner > 0:
                winnersString += "WINNER;" + \
                    str(p.pos) + ";" + str(round(p.totalWinner, 2)) + "#"
        logger.fPrintAndLog("IdTable: " + str(self.tableId) + " WinnersString: " +
                            winnersString, logMethod="DEBUG")
        self.fSendToAll(winnersString)
        time.sleep(3)
        for p in self.players:
            if not p is None:
                self.fSendToAll("UPDATE_PLAYER_STACK;" +
                                str(p.pos) + ";" + str(round(p.balance, 2)) + "#")
                self.fSendToAll("UPDATE_PLAYER_BET;" +
                                str(p.pos) + ";" + str(round(p.bet, 2)) + "#")
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " returning Verificando Ganhador", logMethod="DEBUG")

    def fEvaluateAndSendOdds(self):
        """
            Called before when the hand is over before the showdown.\n
            Evaluate the odds of every player on the hand and send the winning percentage to everyone.
        """
        # TODO Verificar as odds e enviar aos jogadores quando a mão estiver allin antes do river
        # self.fSendToAll("WINPERC" + str(pos) + ";" + str(winperc) + "#")
        pass

    def fSubFromPot(self, value: float):
        ''' Rotina que busca nos potes os valores e subtrai deles '''
        for i in range(0, len(self.pots)):
            if value < self.pots[i]:
                self.pots[i] -= value
                return
            else:
                value -= self.pots[i]
                self.pots[i] = 0

    def fGetTotalPots(self):
        ''' Pega o valor total dos pots '''
        t: float = 0
        for p in self.pots:
            t = t + p
        return t

    def fGetMinBetAllIn(self):
        ''' Pega o menor bet dentre todos os jogadore que foram all-in'''
        qtde: int = 0
        minBet: float = -1
        for p in self.players:
            if p is not None and p.bet > 0 and p.balance == 0:
                qtde += 1
                if minBet == -1 or p.bet < minBet:
                    minBet = p.bet
        # quando tem apenas 1 jogador com bet ainda ele vai retornar -1
        if qtde == 1:
            return -1
        else:
            return minBet

    def fPutBetsToPots(self):
        ''' Envia as apostas dos jogadores para os potes '''
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " Colocando apostas no potes", logMethod="DEBUG")
        minAllInBet: float = self.fGetMinBetAllIn()
        higBet = self.fGetHighestBet()
        secHigBet = self.fGetSecondHighestBet(higBet)
        qtdHigBet = self.fGetNumPlayersWithHighestBet(higBet)
        # se for igual -1 não tenho allin.
        if (minAllInBet == -1):
            for p in self.players:
                if p is not None and p.bet > 0:
                    # Tem apenas 1 jogador com a maior aposta, devolver a diferença para o balance dele.
                    if(len(p.cards) > 1):
                        if(qtdHigBet == 1):
                            if p.bet == higBet:
                                p.balance += p.bet - secHigBet
                                p.bet = secHigBet
                        logger.fPrintAndLog("IdTable: " + str(self.tableId) + 
                            " pote atual: " + str(self.pots[0]), logMethod="DEBUG")
                        logger.fPrintAndLog("IdTable: " + str(self.tableId) + 
                            " bet atual: " + str(p.bet), logMethod="DEBUG")
                        logger.fPrintAndLog("IdTable: " + str(self.tableId) + 
                            " pote total: " + str(self.fGetTotalPots()), logMethod="DEBUG")
                        p.totalBet += p.bet
                        self.pots[len(self.pots)-1] += p.bet
                        p.bet = 0
                    else:
                        logger.fPrintAndLog("IdTable: " + str(self.tableId) + 
                            " atualizando bet de jogador que foldou", logMethod="DEBUG")
                        p.totalBet += p.bet
                        self.pots[len(self.pots)-1] += p.bet
                        p.bet = 0
                    self.fSendToAll(
                        "UPDATE_PLAYER_STACK;" + str(p.pos) + ";" + str(round(p.balance, 2)) + "#")
                    self.fSendToAll(
                        "UPDATE_PLAYER_BET;" + str(p.pos) + ";" + str(round(p.bet, 2)) + "#")
                if p is not None and p.bet == 0 and p.totalBet == 0 and len(p.cards) == 0:
                    # alteracao feita para manter os jogadores na mao ate o final do round.
                    # dessa forma o jogador ira ate o showdown quando for allin
                    # quando termina o round, verifica todos os jogadores que ja foldaram e retira da mesa
                    self.players[self.players.index(p)] = None
        else:
            for p in self.players:
                if p is not None and p.bet > 0:
                    if(len(p.cards) > 1):
                        self.pots[len(self.pots)-1] += minAllInBet
                        p.totalBet += minAllInBet
                        p.bet -= minAllInBet
                    else:
                        logger.fPrintAndLog("IdTable: " + str(self.tableId) + 
                            " atualizando bet de jogador que foldou", logMethod="DEBUG")
                        p.totalBet += p.bet
                        self.pots[len(self.pots)-1] += p.bet
                        p.bet = 0
                    if p is not None and p.bet == 0 and p.totalBet == 0 and len(p.cards) == 0:
                    # alteracao feita para manter os jogadores na mao ate o final do round.
                    # dessa forma o jogador ira ate o showdown quando for allin
                    # quando termina o round, verifica todos os jogadores que ja foldaram e retira da mesa
                        self.players[self.players.index(p)] = None
                    self.fSendToAll(
                        "UPDATE_PLAYER_STACK;" + str(p.pos) + ";" + str(round(p.balance, 2)) + "#")
                    self.fSendToAll("UPDATE_PLAYER_BET;" +
                                    str(p.pos) + ";" + str(round(p.bet, 2)) + "#")
                    
            # Adiciona novo pot com valor zerado.
            self.pots.append(0)
            self.fPutBetsToPots()
            return
        self.fSendToAll(self.fGetPotsString())

    def fSit(self, player: cPlayer, pos: int, amountToAdd: float = 0):
        logger.fPrintAndLog("IdTable: " + str(self.tableId) + " sentando jogador %s na pos %s com %s de stack" % (
            player.name, pos, player.balance))
        ''' Senta o jogador ou reserva o lugar na mesa '''
        if player not in self.players:
            if(len(self.players) == 0):
                self.dealer = -1
            self.players[pos] = player
            self.emptySeats.remove(pos)
            self.currentNumPlayersOnTable += 1
        # Verifica se o valor que o jogador quer comprar de fichas é permitido.
        if self.players[pos] not in self.playersOnHand:
            if self.players[pos] in self.playersAskedToRebuy:
                self.playersAskedToRebuy.remove(self.players[pos])
            self.players[pos].balance += amountToAdd
        else:
            self.players[pos].amountToAdd = amountToAdd
        #self.players[pos].fSetActive()
        self.fSendToSock(self.players[pos].sock, "SIT;ok;%s;%s;%s#" % (pos, self.players[pos].balance, self.players[pos].idAvatar))
        if self.players[pos].balance - amountToAdd == 0:
            self.fSendToOthers(
                self.players[pos].sock, "SIT;" + str(pos) + ";" + str(self.players[pos].balance) + ":" + str(self.players[pos].idAvatar) + "#")
        if(self.fCountActivePlayers() == 0):
            # Ativa o jogador para que possamos iniciar a mão, pois ainda não tem jogo
            self.players[pos].isNew = False
            self.players[pos].sitOut = False
            self.players[pos].sitOutNextHand = False
            self.players[pos].sitOutNextBigBlind = False
            self.players[pos].bigBlindPassedWhenSitOut = False
            return
            # verifica novamente a quantidade de jogadores ativos.
        # if(self.fCountActivePlayers() < 2):
        #     if not self.fSomeoneHaveCards():
        #         self.fNewHand()
        # if not self.handIsBeingPlayed:
        #    self.fNewHand()
        if self.players[pos].isNew:
            self.players[pos].isNew = False
            #self.players[pos].qtdHandsBigBlind = self.maxPlayers
        return True

    def fAddStackAmountToPlayers(self):
        """
            Adiciona o valor que o jogador pediu para adicionar durante uma mao. \n
            Esta funcao esta sendo chamada somente no inicio de uma nova mao.
        """
        for p in self.players:
            if p is not None:
                if p.amountToAdd > 0:
                    # Verificando na hora de adicionar se o amountToCall é maior que o MaxBuyIn, pois ele pode ter ganho a mão
                    if(p.balance < self.maxBuyIn):
                        if p.balance + p.amountToAdd > self.maxBuyIn:
                            p.balance = self.maxBuyIn
                        else:
                            p.balance += p.amountToAdd
                    p.amountToAdd = 0
                    self.fSendToAll(
                        "UPDATE_PLAYER_STACK;" + str(p.pos) + ";" + str(round(p.balance, 2)) + "#")

    def fVerifyPlayersDoingRebuy(self):
        """
            Verifica se tem jogadores sem stack e sem amountToAdd
        """
        for p in self.players:
            if p is not None:
                if p.amountToAdd == 0 and p.balance == 0 and not p.isNew and not p.sitOut:
                    return True
        return False

    def fSitOut(self, pos):
        ''' SitOut o jogador '''
        # seta o jogador como inativo
        self.players[pos].fSetInactive()
        self.fSendToSock(self.players[pos].sock, "SIT_OUT;ok#")
        self.fSendToOthers(self.players[pos].sock, "SIT_OUT;" + str(pos) + "#")
        return True

    # def fGetOutOfTable(self, pos: int):
    #     ''' Sai da mesa '''
    #     # Tira o jogador da lista de jogadores
    #     if(not self.players[pos] is None):
    #         if len(self.players[pos].cards) > 0:
    #             self.players[pos].sock = None
    #             self.players[pos].isMarkedToExit = True
    #             if(pos == self.positionToAct):
    #                 if "Check" in self.fCheckValidActions():
    #                     self.fCheck(pos)
    #                 elif "Fold" in self.fCheckValidActions():
    #                     self.fFold(pos)
    #         else:
    #             self.fSendToSock(self.players[pos].sock, "EXIT;ok#")
    #             self.fSendToOthers(
    #                 self.players[pos].sock, "EXIT;" + str(pos) + "#")
    #             self.players[pos] = None
    #             self.currentNumPlayersOnTable -= 1
    #     return True

    def fFold(self, pos: int):
        ''' Folda '''
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " Entrando acao de fold", logMethod="DEBUG")
        # verifica se é a vez e se a ação é valida
        if(self.positionToAct == pos and "FOLD" in self.fCheckValidActions()):
            # retira as cartas do jogador
            self.players[pos].cards = []
            for p in self.playersOnHand:
                if p is not None:
                    if p.pos == pos:
                        self.players[pos].actedOnRound = True
                        #self.playersOnHand.remove(p)
                        # envia as informacoes para os jogadores
                        self.timer.stop(pos)
                        self.fSendToSock(self.players[pos].sock, "FOLD;ok#")
                        self.fSendToOthers(
                            self.players[pos].sock, "FOLD;" + str(pos) + "#")
                        # volta pro loop de acoes
                        self.fGetBackToPool(p)
                        self.fTreatAction()
                        return True
        self.fSendToSock(self.players[pos].sock, "FOLD;invalid#")
        if(pos == self.positionToAct):
            self.fSendValidActions()
        return False

    def fCall(self, pos: int):
        ''' Call '''
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " Entrando acao de call", logMethod="DEBUG")
        # verifica se é a vez e se a ação é valida
        if(self.positionToAct == pos and "CALL" in self.fCheckValidActions()):
            # verifica se tem balance suficiente pra dar o call
            amountToCall = self.fGetHighestBet() - self.players[pos].bet
            if (amountToCall > self.players[pos].balance):
                amountToCall = self.players[pos].balance
            self.players[pos].bet += amountToCall
            self.players[pos].balance -= amountToCall
            self.players[pos].actedOnRound = True
            # Adiciona o jogador na lista de jogadores Allin para validar se a mao acabou com todos indo allin
            if (self.players[pos].balance) == 0:
                self.playersAllinOnHand += 1
            # envia as informacoes para os jogadores
            self.timer.stop(pos)
            self.fSendToSock(self.players[pos].sock, "CALL;ok#")
            self.fSendToOthers(
                self.players[pos].sock, "CALL;" + str(pos) + "#")
            self.fSendToAll("UPDATE_PLAYER_STACK;" + str(pos) +
                            ";" + str(round(self.players[pos].balance, 2)) + "#")
            self.fSendToAll("UPDATE_PLAYER_BET;" + str(pos) +
                            ";" + str(round(self.players[pos].bet, 2)) + "#")
            # volta pro loop de acoes
            self.fTreatAction()
            return True
        self.fSendToSock(self.players[pos].sock, "CALL;invalid#")
        if(pos == self.positionToAct):
            self.fSendValidActions()
        return False

    def fCheck(self, pos: int):
        ''' Check '''
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " Entrando acao de check", logMethod="DEBUG")
        # verifica se é a vez e se a ação é valida
        if(self.positionToAct == pos and "CHECK" in self.fCheckValidActions()):
            self.players[pos].actedOnRound = True
            # envia as informacoes para os jogadores
            self.timer.stop(pos)
            self.fSendToSock(self.players[pos].sock, "CHECK;ok#")
            self.fSendToOthers(
                self.players[pos].sock, "CHECK;" + str(pos) + "#")
            # volta pro loop de acoes
            self.fTreatAction()
            return True
        self.fSendToSock(self.players[pos].sock, "CHECK;invalid#")
        if(pos == self.positionToAct):
            self.fSendValidActions()
        return False

    def fRaise(self, pos: int, bet: float):
        ''' Raise '''
        logger.fPrintAndLog("IdTable: " + str(self.tableId) + " Entrando acao de raise, posicao: " +
                            str(pos) + " Aposta: " + str(bet), logMethod="INFO")
        #print("acao de raise")
        # verifica se é a vez e se a ação é valida
        if(self.positionToAct == pos and "RAISE" in self.fCheckValidActions()):
            self.players[pos].actedOnRound = True
            # se a aposta for menor que o minimo, apostar o minimo.
            if(bet < self.minBet):
                bet = self.minBet
            # se a aposta for maior que o maximo, apostar o maximo.
            if(bet > self.maxBet):
                bet = self.maxBet
            self.players[pos].balance -= bet - self.players[pos].bet
            if (self.fGetHighestBet() < self.bigBlind and self.fGetHighestBet() > 0):
                self.players[pos].betDifference = bet - self.bigBlind
            else:
                self.players[pos].betDifference = bet - self.fGetHighestBet()
            self.players[pos].bet = bet
            # Adiciona o jogador no contador de jogadores Allin para validar se a mao acabou com todos indo allin
            if (self.players[pos].balance == 0 or bet >= self.fGetHighestPossibleTotalBet()):
                self.playersAllinOnHand += 1
            # envia as informacoes para os jogadores
            self.timer.stop(pos)
            self.fSendToSock(self.players[pos].sock, "RAISE;ok#")
            self.fSendToOthers(
                self.players[pos].sock, "RAISE;" + str(pos) + "#")
            self.fSendToAll("UPDATE_PLAYER_STACK;" + str(pos) +
                            ";" + str(round(self.players[pos].balance, 2)) + "#")
            self.fSendToAll("UPDATE_PLAYER_BET;" + str(pos) +
                            ";" + str(round(self.players[pos].bet, 2)) + "#")
            # volta pro loop de acoes
            self.fTreatAction()
            return True
        self.fSendToSock(self.players[pos].sock, "RAISE;invalid#")
        if(pos == self.positionToAct):
            self.fSendValidActions()
        return False

    def fSelectBlindPositions(self):
        higBBCount = 0
        for p in self.players:
            if p is not None:
                if p.qtdHandsBigBlind > higBBCount:
                    higBBCount = p.qtdHandsBigBlind
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " higBBCount = %s" % higBBCount)
        playersToBeBigBlind = []
        for p in self.players:
            if p is not None:
                if p.qtdHandsBigBlind == higBBCount:
                    playersToBeBigBlind.append(p.pos)
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " playersToBeBigBlind = %s" % playersToBeBigBlind)
        self.bigBlindPosition = random.choice(playersToBeBigBlind)
        if self.players[self.bigBlindPosition].sitOutNextBigBlind:
            self.players[self.bigBlindPosition].sitOutNextHand=True
            self.handIsBeingPlayed = False
            self.fGetBackToPool(self.players[self.bigBlindPosition])
            return False
        #self.players[self.bigBlindPosition].qtdHandsBigBlind -= self.fCountActivePlayers()
        self.players[self.bigBlindPosition].qtdHandsBigBlind = 0
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " BigBlind = %s" % self.bigBlindPosition)
        self.smallBlindPosition = self.fGetPrevPos(self.bigBlindPosition, False)
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " SmallBlind = %s" % self.smallBlindPosition)
        if self.fCountActivePlayers()==2:
            self.dealer = self.fGetPrevPos(self.bigBlindPosition, False)
        else:
            self.dealer = self.fGetPrevPos(self.smallBlindPosition, False)
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            "Dealer = %s" % self.dealer)
        # self.smallBlindPosition = 0
        # self.bigBlindPosition = 0
        # dealerTemp = self.fGetNextPos(self.dealer, False, isDealer=True)
        # if(dealerTemp == -1):
        #     dealerTemp = self.dealer
        # smallTemp = self.fGetNextPos(dealerTemp, False, isSmallBlind=True)
        # if(smallTemp == -1):
        #     smallTemp = dealerTemp
        # bigTemp = self.fGetNextPos(smallTemp, False, isBigBlind=True)
        # if(bigTemp == -1):
        #     self.fSendToAll("CLEAR_TABLE#")
        #     logger.fPrintAndLog(
        #         "Não tem nenhum jogador para ser o BigBlind.", logMethod="DEBUG")
        #     self.handIsBeingPlayed = False
        #     return False
        # elif(self.fCountActivePlayers() == 1):
        #     self.dealer = dealerTemp
        #     #self.fNewHand()
        #     return False
        # elif(self.fCountActivePlayers() == 2):
        #     # Só vai entrar aqui na primeira mão que a mesa for jogar.
        #     # Sorteia o Dealer entre os jogadores da mesa.
        #     if(self.dealer == -1):
        #         # seta para zero o dealer para percorrer todo o vetor.
        #         self.dealer = 0
        #         for _ in range(0, random.randint(1, 2)):
        #             self.dealer = self.fGetNextPos(
        #                 self.dealer, False, isBigBlind=True)
        #         #self.fNewHand()
        #         return False
        #     self.dealer = dealerTemp
        #     self.smallBlindPosition = dealerTemp
        #     if(dealerTemp == smallTemp):
        #         self.bigBlindPosition = self.fGetNextPos(
        #             self.smallBlindPosition, False, isBigBlind=True)
        #     else:
        #         self.bigBlindPosition = smallTemp
        # else:
        #     self.dealer = dealerTemp
        #     self.smallBlindPosition = smallTemp
        #     self.bigBlindPosition = bigTemp
        #     # When the game have 3 or more, The position of the Small Blind is the right after the Button and the Big Blind is right after the Small Blind.
        #     # Check if have a player in position to enter paying the bigblind
        #     for p in self.players:
        #         if p is not None:
        #             if (p.sitOut or p.isNew) and not p.sitOutNextHand and not p.waitForBlind:
        #                 if(self.dealer > smallBlindPosition and (p.pos < self.dealer and p.pos > smallBlindPosition)):
        #                     # Verify if need to play big or small from ante
        #                     if(p.bigBlindPassedWhenSitOut):
        #                         self.fPlaceBlind(p.pos, float(self.bigBlind))
        #                     if(not p.isNew and p.smallBlindPassedWhenSitOut):
        #                         self.fPlaceAntes(p.pos, float(self.smallBlind))
        #                     self.players[p.pos].isNew = False
        #                     self.players[p.pos].sitOut = False
        #                     self.players[p.pos].sitOutNextHand = False
        #                     self.players[p.pos].sitOutNextBigBlind = False
        #                     self.players[p.pos].bigBlindPassedWhenSitOut = False
        #                     self.players[p.pos].smallBlindPassedWhenSitOut = False
        #                 if(self.dealer < smallBlindPosition and (p.pos < self.dealer or p.pos > smallBlindPosition)):
        #                     # Verify if need to play big or small from ante
        #                     if(p.bigBlindPassedWhenSitOut):
        #                         self.fPlaceBlind(p.pos, float(self.bigBlind))
        #                     if(not p.isNew and p.smallBlindPassedWhenSitOut):
        #                         self.fPlaceAntes(p.pos, float(self.smallBlind))
        #                     self.players[p.pos].isNew = False
        #                     self.players[p.pos].sitOut = False
        #                     self.players[p.pos].sitOutNextHand = False
        #                     self.players[p.pos].sitOutNextBigBlind = False
        #                     self.players[p.pos].bigBlindPassedWhenSitOut = False
        #                     self.players[p.pos].smallBlindPassedWhenSitOut = False
        return True

    def fNewHand(self):
        ''' Inicia uma nova mão '''
        # Inicia nova mão.
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " Iniciando nova mao", logMethod="DEBUG")
        self.handIsBeingPlayed = True
        self.actTimeTest = 1
        self.playersOnHand = []
        self.playersAllinOnHand = 0
        self.fAddStackAmountToPlayers()
        if self.fAskPlayersToRebuy():
            # setta o timer para a mesa inteira por 5seg e cancela o inicio da mao.
            self.timer.setTimer(-1, 5, "BUY")
            self.handIsBeingPlayed = False
            return True
        self.fRemoveSitoutPlayers()
        self.pots.clear()
        self.pots.append(0)
        self.board.clear()
        self.fClearRoundInfo(True)
        if self.fCountActivePlayers()==1:
            self.handIsBeingPlayed = False
            return False
        if not self.fSelectBlindPositions():
            #entra aqui se tiver que recomecar a mao apos selecionar as posicoes das blinds
            return self.fNewHand()
        logger.fPrintAndLog("IdTable: " + str(self.tableId) + " Jogadores ativos " +
                            str(self.fCountActivePlayers()), logMethod="DEBUG")
        self.deck.fShuffle()
        self.round = 0
        self.handNumber += 1
        self.fAddPlayersOnTableToHand()
        self.fSendToAll("NEW_HAND;" + str(self.handNumber) + ";" +
                        str(self.smallBlind) + ";" + str(self.bigBlind) + "#")
        self.fSendTable()
        # self.fSendToAll(self.fGetPotsString())
        # self.fSendToAll("UPDATE_DEALER;" + str(self.dealer) + "#")
        # chama a funcao que coloca as antes e depois as blinds.
        if (self.ante != 0):
            self.fPlaceAntes()
        self.fPlaceBlind(self.smallBlindPosition, float(self.smallBlind))
        self.fPlaceBlind(self.bigBlindPosition, float(self.bigBlind))
        self.positionToAct = self.bigBlindPosition
        self.fSendCards(self.dealer)
        self.fTreatAction()
        return True

    def fClearRoundInfo(self, isNewHand: bool = False):
        """
            Clear the round info. \n
            Receives a parameter if its a new hand to clear the info necessary to play a new hand.
        """
        for p in self.players:
            if p is not None:
                p.actedOnRound = False
                p.betDifference = 0
                p.bet = 0
                if isNewHand:
                    p.totalBet = 0
                    p.totalWinner = 0
                    p.evalMyHand = 0
                    p.cards.clear()

    def fAddPlayersOnTableToHand(self):
        """
            Add all the players allowed to play the hand to the actual hand
        """
        # verify who is able to play or not.
        for p in self.players:
            if p is not None and p.balance > 0 and not p.sitOut:
                self.playersOnHand.append(p)

    def fRemoveSitoutPlayers(self):
        """
            Remove the sitout players from the table
        """
        for p in self.players:
            if (p is not None) and p.isMarkedToExit == True:
                self.fSendToSock(p.sock, "EXIT;ok#")
                self.fSendToOthers(p.sock, "EXIT;" + str(p.pos) + "#")
                self.players[p.pos] = None
                self.currentNumPlayersOnTable -= 1
            if (p is not None) and p.sitOutNextHand == True:
                self.players[p.pos].sitOut = True
                self.fSendToAll("SIT_OUT;" + str(p.pos) + "#")
            if (p is not None) and p.balance == 0:
                self.players[p.pos].sitOut = True
                self.fSendToAll("SIT_OUT;" + str(p.pos) + "#")

    def fCheckValidActions(self):
        """
            Returns an array with valid actions for the actual player and set the table variables for minBet, maxBet
        """
        self.mtxCheckActions.acquire()
        logger.fPrintAndLog(
            "IdTable: " + str(self.tableId) + "Entrando no validador de acoes", logMethod="DEBUG")
        if(self.positionToAct == -1):
            return False
        pos = self.positionToAct
        # caso jogador nao tenha fichas, nao tem acao disponivel.
        validActions = []
        self.minBet = 0
        self.maxBet = 0
        self.amountToCall = 0
        if (self.players[pos].balance > 0 and not self.players[pos].sitOut):
            # Jogador sempre pode foldar se tiver fichas.
            validActions.append("FOLD")
            logger.fPrintAndLog(
                "IdTable: " + str(self.tableId) + " Validou Fold", logMethod="DEBUG")
            if(self.fGetHighestBet() == self.players[pos].bet):
                # Jogador so pode dar check se a maior aposta for a mesma que a dele
                validActions.append("CHECK")
                logger.fPrintAndLog(
                    "IdTable: " + str(self.tableId) + " Validou Check", logMethod="DEBUG")
            elif(self.fGetHighestBet() > self.players[pos].bet):
                # Jogador so pode dar call
                validActions.append("CALL")
                if self.fGetHighestBet() > self.players[pos].bet + self.players[pos].balance:
                    self.amountToCall = self.players[pos].balance + \
                        self.players[pos].bet
                else:
                    self.amountToCall = self.fGetHighestBet()
                if(self.amountToCall < self.bigBlind):
                    self.amountToCall = self.bigBlind
                logger.fPrintAndLog(
                    "IdTable: " + str(self.tableId) + " Validou Call", logMethod="DEBUG")
            if (len(self.playersOnHand)-1 == self.playersAllinOnHand):
                # Valida se é o ultimo jogador a falar quando todos os oponentes estao allin
                validActions.append("RAISE")
                logger.fPrintAndLog(
                    "IdTable: " + str(self.tableId) + " Validou Allin", logMethod="DEBUG")
                if (self.players[pos].balance + self.players[pos].bet <= self.fGetHighestBet()):
                    self.minBet = self.players[pos].balance + \
                        self.players[pos].bet
                    self.maxBet = self.players[pos].balance + \
                        self.players[pos].bet
                else:
                    self.minBet = self.fGetHighestBet()
                    self.maxBet = self.fGetHighestBet()

            elif (self.fGetHighestBet()-self.players[pos].bet >= self.players[pos].betDifference):
                # Jogador so pode dar raise se a diference entre a maior aposta e a ultima aposta dele for maior que o aumento realizado na ultima aposta, isso so nao acontece em alguns casos de allin
                validActions.append("RAISE")
                logger.fPrintAndLog(
                    "IdTable: " + str(self.tableId) + " Validou Raise", logMethod="DEBUG")
                if self.betLimit == eBetLimits.NoLimit or self.betLimit == eBetLimits.PotLimit:  # no limit ou pot limit
                    prevPos = self.fGetPrevPos(pos, hasBet=True)
                    highBet = self.fGetHighestBet()
                    secHighBet = self.fGetSecondHighestBet(highBet)
                    if self.round == 0:
                        if highBet < self.bigBlind:
                            highBet = self.bigBlind
                        if secHighBet < self.bigBlind and secHighBet > 0:
                            secHighBet = self.bigBlind
                    if(prevPos != -1):
                        # Valor minimo de aposta é = a diferenca entre a maior aposta e a segunda maior aposta + maior aposta.
                        self.minBet = highBet - secHighBet + highBet
                    if self.minBet < self.bigBlind + highBet:
                        # caso o valor seja menor que 1 big blind de aumento, o valor minimo agora é 1 big blind + a maior aposta.
                        self.minBet = highBet + self.bigBlind
                    if self.minBet > self.players[pos].balance + self.players[pos].bet:
                        # Valor minimo de aposta é 1big blind + a maior aposta.
                        self.minBet = self.players[pos].balance + \
                            self.players[pos].bet
                    if self.betLimit == eBetLimits.NoLimit:  # no limit
                        # se o limite de aposta for no-limit, o limite é o máximo que temos de balance
                        self.maxBet = self.players[pos].balance + \
                            self.players[pos].bet
                    if self.betLimit == eBetLimits.PotLimit:  # pot limit
                        # se o limite de aposta for pot-limit, o limite de aposta é o pote (poteAtual+UltimaAposta-MinhaAposta+UltimaAposta)
                        self.maxBet = self.pots[0] + self.fGetAllBets() + \
                            highBet - self.players[pos].bet + highBet
                        if self.maxBet > self.players[pos].balance + self.players[pos].bet:
                            self.maxBet = self.players[pos].balance + \
                                self.players[pos].bet
        logger.fPrintAndLog("IdTable: " + str(self.tableId) + " Acoes validas: " +
                            str(validActions), logMethod="DEBUG")
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " minbet: " + str(self.minBet), logMethod="DEBUG")
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " maxbet: " + str(self.maxBet), logMethod="DEBUG")
        logger.fPrintAndLog("IdTable: " + str(self.tableId) + " amountToCall: " +
                            str(self.amountToCall), logMethod="DEBUG")
        self.mtxCheckActions.release()
        return validActions

    def fSendTableCards(self, sock=None, addCardsOnBoard=True):
        ''' Envia cartas que estão na mesa 
            sock = None, envia para todos os jogadores.'''
        # Envia as cartas da mesa para todo munndo.
        if self.round == 1:
            if addCardsOnBoard:
                self.board.append(cCard(self.deck.fGetCard(47)))
                self.board.append(cCard(self.deck.fGetCard(48)))
                self.board.append(cCard(self.deck.fGetCard(49)))
            if(sock is None):
                self.fSendToAll("SHOW_TABLE_CARD;flop;" + str(self.board[0].fGetCard()) + str(
                    self.board[1].fGetCard()) + str(self.board[2].fGetCard()) + "#")
            else:
                self.fSendToSock(sock, "SHOW_TABLE_CARD;flop;" + str(self.board[0].fGetCard()) + str(
                    self.board[1].fGetCard()) + str(self.board[2].fGetCard()) + "#")
        elif self.round == 2:
            if addCardsOnBoard:
                self.board.append(cCard(self.deck.fGetCard(50)))
            if(sock is None):
                self.fSendToAll("SHOW_TABLE_CARD;turn;" +
                                str(self.board[3].fGetCard()) + "#")
            else:
                self.fSendToSock(sock, "SHOW_TABLE_CARD;turn;" +
                                 str(self.board[3].fGetCard()) + "#")
        elif self.round == 3:
            if addCardsOnBoard:
                self.board.append(cCard(self.deck.fGetCard(51)))
            if(sock is None):
                self.fSendToAll("SHOW_TABLE_CARD;river;" +
                                str(self.board[4].fGetCard()) + "#")
            else:
                self.fSendToSock(sock, "SHOW_TABLE_CARD;river;" +
                                 str(self.board[4].fGetCard()) + "#")

    def fSendShowDown(self):
        ''' Envia show Down para todo mundo '''
        # Enviando informações referente as cartas para todo mundo
        for p in self.players:
            if p is not None and len(p.cards) > 1:
                if self.gameType == eGameTypes.Texas:
                    self.fSendToOthers(p.sock, "PLAYER_CARD;" + str(p.pos) + ";" + str(
                        p.cards[0].fGetCard()) + str(p.cards[1].fGetCard()) + "#")
                elif self.gameType == eGameTypes.Omaha:
                    self.fSendToOthers(p.sock, "PLAYER_CARD;" + str(p.pos) + ";" + str(p.cards[0].fGetCard()) + str(
                        p.cards[1].fGetCard()) + str(p.cards[2].fGetCard()) + str(p.cards[3].fGetCard()) + "#")
        return True

    def fSendValidActions(self, validActions=[], startTimer: bool = False):
        ''' Envia ações válidas para o jogador atual '''
        if validActions == []:
            validActions = self.fCheckValidActions()
        validActionsString = ""
        for action in validActions:
            validActionsString += ";" + action
        logger.fPrintAndLog("IdTable: " + str(self.tableId) +
                            " Enviando acoes validas", logMethod="DEBUG")
        if startTimer:
            # ainda esta bugado pois a thread nao está morrendo apos uma acao.
            self.timer.setTimer(self.positionToAct, self.timeToAct)
            # if self.timer.is_alive():
            #     print("timer is alive")
            #     self.timer.useTimer()
            # else:
        self.fSendToSock(self.players[self.positionToAct].sock, "PLAYER_TURN;" + str(self.positionToAct) +  ";" + str(self.timeToAct) + ";" + str(round(
            self.amountToCall, 2)) + ";" + str(round(self.minBet, 2)) + ";" + str(round(self.maxBet, 2)) + validActionsString + "#")
        self.fSendToOthers(
            self.players[self.positionToAct].sock, "PLAYER_TURN;" + str(self.positionToAct) + ";" + str(self.timeToAct) + "#")
        pass

    def fEndHand(self):
        logger.fPrintAndLog("IdTable: " + str(self.tableId) + " mao acabou")
        if self.pool is not None:
        # colocar os jogadores de volta na pool
            for p in self.players:
                if p is not None:
                    if p.sock is not None:
                        self.fGetBackToPool(p)
                    #p = None
        self.timer.stopThread = True
        for i in range(len(self.pool.tablePool)):
            if self.pool.tablePool[i] is not None:
                if self.pool.tablePool[i].tableId == self.tableId:
                    self.pool.tablePool[i].playersAskedToRebuy == []
                    self.pool.tablePool[i].handIsBeingPlayed = False
                    self.pool.tablePool[i] = None
                    break
        # self.pool.tablePoolAvaiable.remove(self)
#        self.handIsBeingPlayed = False

    def fGetBackToPool(self, player):
        logger.fPrintAndLog("IdTable: " + str(self.tableId) + 
            "Colocando jogador %s da mesa %s de volta na pool" % (player.name, self.tableId))
        if self.pool is not None:
            if player is not None:
                if player.sock is not None:
                    self.fSendToSock(player.sock, "CLEAR_TABLE#")
                    player.qtdHandsBigBlind += 1
                    if player in self.playersOnHand:
                        self.playersOnHand.remove(player)
                    
                        # self.emptySeats.append(player.pos)
                    if player.sock in self.socks:
                        self.socks.remove(player.sock)
                    if self.handIsBeingPlayed:
                        self.players[player.pos] = copy(player)
                        self.players[player.pos].sock = None
                        self.players[player.pos].cards = []
                    else:
                        self.emptySeats.append(player.pos)
                        self.players[player.pos] = None
                        
                    #self.players[player.pos] = cPlayer(player.name, player.idPlayer, player.pos, player.balance)
                    #self.players[player.pos].bet = player.bet
                    self.pool.fEnterPool(player, player.balance)
        # colocar os jogadores de volta na pool
        pass

    def fTreatAction(self):
        ''' Trata as ações '''
        if(len(self.playersOnHand) == 1):
            logger.fPrintAndLog("IdTable: " + str(self.tableId) + 
                "Um jogador sobrando, mao acabou", logMethod="DEBUG")
            # todos os adversarios foldaram
            self.fPutBetsToPots()
            self.fVerifyWinner()
            # TODO Save on DB the gamestate at the end of the hand
            time.sleep(2)
            # self.fNewHand()
            self.fEndHand()
            return
        else:
            # Se todos tiverem o mesmo valor de aposta e tiverem agido no round Inicia proximo ROUND
            if (len(self.playersOnHand)-1 <= self.playersAllinOnHand and self.fVerifyAllPlayersWithSameBet(self.fGetHighestBet())):
                logger.fPrintAndLog("IdTable: " + str(self.tableId) + 
                    "Todos os envolvidos estao allin", logMethod="DEBUG")
                # tratando para o caso de termos jogadores allin antes do showdown
                self.fPutBetsToPots()
                self.fClearRoundInfo()
                logger.fPrintAndLog(
                    "IdTable: " + str(self.tableId) + " Showdown", logMethod="DEBUG")
                self.fSendShowDown()
                time.sleep(2)
                # self.positionToAct = self.dealer
                if self.round == 0:
                    logger.fPrintAndLog(
                        "IdTable: " + str(self.tableId) + " Dealing flop", logMethod="DEBUG")
                    self.round += 1
                    self.fSendTableCards()
                    time.sleep(2)
                if self.round == 1:
                    logger.fPrintAndLog(
                        "IdTable: " + str(self.tableId) + " Dealing turn", logMethod="DEBUG")
                    self.round += 1
                    self.fSendTableCards()
                    time.sleep(2)
                if self.round == 2:
                    logger.fPrintAndLog(
                        "IdTable: " + str(self.tableId) + " Dealing river", logMethod="DEBUG")
                    self.round += 1
                    self.fSendTableCards()
                    time.sleep(3)
                if self.round == 3:
                    self.fVerifyWinner()
                    # TODO Save on DB the gamestate at the end of the hand()
                    time.sleep(4)
                    # self.fNewHand()
                    self.fEndHand()
                    return
            if((self.fVerifyAllPlayersActed() and self.fVerifyAllPlayersWithSameBet(self.fGetHighestBet()))):
                logger.fPrintAndLog("IdTable: " + str(self.tableId) + 
                    "todos jogadores agiram na mão e estão com a mesma aposta, dealing new round", logMethod="DEBUG")
                self.positionToAct = self.dealer
                if self.round == 0:
                    logger.fPrintAndLog(
                        "IdTable: " + str(self.tableId) + " Dealing flop", logMethod="DEBUG")
                    self.fPutBetsToPots()
                    self.fClearRoundInfo()
                    self.round += 1
                    self.fSendTableCards()
                elif self.round == 1:
                    logger.fPrintAndLog(
                        "IdTable: " + str(self.tableId) + " Dealing turn", logMethod="DEBUG")
                    self.fPutBetsToPots()
                    self.fClearRoundInfo()
                    self.round += 1
                    self.fSendTableCards()
                elif self.round == 2:
                    logger.fPrintAndLog(
                        "IdTable: " + str(self.tableId) + " Dealing river", logMethod="DEBUG")
                    self.fPutBetsToPots()
                    self.fClearRoundInfo()
                    self.round += 1
                    self.fSendTableCards()
                elif self.round == 3:
                    logger.fPrintAndLog(
                        "IdTable: " + str(self.tableId) + " Showdown", logMethod="DEBUG")
                    self.fSendShowDown()
                    time.sleep(2)
                    self.fPutBetsToPots()
                    #time.sleep(1)
                    self.fVerifyWinner()
                    time.sleep(3)
                    # TODO Save on DB the gamestate at the end of the hand()
                    # self.fNewHand()
                    self.fEndHand()
                    return
        self.positionToAct = self.fGetNextPos(self.positionToAct)
        validActions = self.fCheckValidActions()
        # Se o jogador estiver sitout envia acao automaticamente
        if (self.players[self.positionToAct].isMarkedToExit):
            if("Check" in validActions):
                self.fCheck(self.positionToAct)
            else:
                self.fFold(self.positionToAct)
            return
        # TODO gravar o horario do envio da mensagem para verificar timeout
        # envia acoes somente se o jogador tiver acoes validas.
        if (validActions != []):
            self.countTest = 0
            self.fSendValidActions(validActions, startTimer=True)
        else:
            if (self.countTest <= 10):
                # caso contrario, passa para o proximo jogador.
                self.countTest += 1
                logger.fPrintAndLog(
                    "IdTable: " + str(self.tableId) + " Acoes validas é vazio", logMethod="DEBUG")
                self.players[self.positionToAct].actedOnRound = True
                self.fTreatAction()
        return True
