from server.table import cTable
from threading import Thread
from server.table import cTable
from server.enumerates import eGameTypes, eBetLimits
from server.connection import cConnection
import random
import time
from server.logger import cLogger
from server.player import cPlayer
from server.db.tbpool import ctbPool
from server.db.tbuser import ctbUser
tbuser: ctbUser = ctbUser()
tbpool: ctbPool = ctbPool()
logger = cLogger("pool")


class thTable(Thread):
    def __init__(self, pool, msg, p: cPlayer):
        Thread.__init__(self)
        self.message = msg
        self.player: cPlayer = p
        self.pool = pool
        self.conn = cConnection(False)
        self.tablePos: int = -1
        for i in range(len(self.pool.tablePool)):
            if self.pool.tablePool[i] is not None:
                if self.pool.tablePool[i].tableId == pool.dictPlayerIDtoTableId[self.player.idPoolPlayer]:
                    self.tablePos = i
                    break

    def run(self):
        opts = self.message.split(";")
        #corrigindo player pos que não esta vindo corretamente.
        if self.tablePos != -1:
            for pl in self.pool.tablePool[self.tablePos].players:
                if pl is not None:
                    if pl.idPlayer == self.player.idPlayer:
                        logger.fPrintAndLog("Corrigindo player pos. posOld: %s posNew: %s" %(
                                self.player.pos, pl.pos) , logMethod="INFO")
                        self.player.pos = pl.pos
        if (opts[0] == "SIT"):
            if len(opts) > 1:
                amountToAdd = opts[1]
            else:
                amountToAdd = 0
            self.pool.tablePool[self.tablePos].fSit(self.player, int(self.player.pos),
                                                    round(float(amountToAdd), 2))
        elif(opts[0] == "REQUEST_BUY"):
            self.pool.tablePool[self.tablePos].fPlayerWantsToRebuy(
                int(self.player.pos))
        elif(opts[0] == "SIT_OUT_NEXT_HAND"):
            if(opts[1] == '0'):
                self.player.sitOutNextHand = False
                self.player.sitOutNextBigBlind = False
                if(not self.player.sitOut):
                    if(self.tablePos != -1):
                        self.pool.tablePool[self.tablePos].fCancelSitOutNext(
                            int(self.player.pos))                
                self.conn.fSend(self.player.sock, "SITOUT_NEXT_HAND;ok;0#")
                if(self.player.sitOut):
                    self.player.sitOut = False
                    self.pool.playerPoolAvaiable.append(self.player)
            else:
                self.player.sitOutNextHand = True
                if(self.tablePos != -1):
                    self.pool.tablePool[self.tablePos].fSitOutNextHand(
                        int(self.player.pos))
                self.conn.fSend(self.player.sock, "SITOUT_NEXT_HAND;ok;1#")
                self.conn.fSend(self.player.sock, "SITOUT_NEXT_BB;ok;0#")
        elif(opts[0] == "SIT_OUT_NEXT_BLIND"):
            if(opts[1] == '0'):
                self.player.sitOutNextHand = False
                self.player.sitOutNextBigBlind = False
                if(not self.player.sitOut):
                    if(self.tablePos != -1):
                        self.pool.tablePool[self.tablePos].fCancelSitOutNext(
                            int(self.player.pos))                
                self.conn.fSend(self.player.sock, "SITOUT_NEXT_BB;ok;0#")
                if(self.player.sitOut):
                    self.player.sitOut = False
                    self.pool.playerPoolAvaiable.append(self.player)
            else:
                self.player.sitOutNextBigBlind = True
                if(self.tablePos != -1):
                    self.pool.tablePool[self.tablePos].fSitOutNextBlind(
                        int(self.player.pos))
                self.conn.fSend(self.player.sock, "SITOUT_NEXT_HAND;ok;0#")
                self.conn.fSend(self.player.sock, "SITOUT_NEXT_BB;ok;1#")
        elif(opts[0] == "WAIT_BIG_BLIND"):
            if not self.pool.tablePool[self.tablePos].isTournament:
                self.pool.tablePool[self.tablePos].fWaitBigBlind(
                    int(self.player.pos), (opts[1] == '1'))
        elif(opts[0] == "FOLD"):
            self.pool.tablePool[self.tablePos].fFold(self.player.pos)
        elif (opts[0] == "CALL"):
            logger.fPrintAndLog("acao de call pos: %s" %
                                self.player.pos, logMethod="INFO")
            self.pool.tablePool[self.tablePos].fCall(self.player.pos)
        elif(opts[0] == "CHECK"):
            self.pool.tablePool[self.tablePos].fCheck(self.player.pos)
        elif(opts[0] == "QUIT"):
            self.pool.tablePool[self.tablePos].fEndHand()
        elif (opts[0] == "RAISE"):
            if len(opts) > 1:
                amountToRaise = opts[1]
            else:
                amountToRaise = 0
            self.pool.tablePool[self.tablePos].fRaise(
                self.player.pos, round(float(amountToRaise), 2))


class ThPoolOrganizer(Thread):
    def __init__(self, pool):
        self.pool = pool
        self.tablePool = pool.tablePool
        self.playerPoolAvaiable = pool.playerPoolAvaiable
        self.tablePoolAvaiable = pool.tablePoolAvaiable
        self.dictPlayerIDtoTableId = pool.dictPlayerIDtoTableId
        self.conn = cConnection(False)

        Thread.__init__(self)
        self.start()

    def fAddPlayerToTable(self, idPoolPlayer, tablePos):

        logger.fPrintAndLog("adding player to table", logMethod="INFO")
        logger.fPrintAndLog("size of player pool: %s" %
                            len(self.playerPoolAvaiable), logMethod="INFO")
        #Sempre é passado para adicionar o primeiro jogador.
        indexOnPlayerPoolAvaiable = 0
        # for i in range(len(self.playerPoolAvaiable)):
        #     if self.playerPoolAvaiable[i].idPoolPlayer == idPoolPlayer:
        #         indexOnPlayerPoolAvaiable = i
        #         break
        if(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].balance == 0):
            # Send Values for min and max BuyIn
            self.tablePoolAvaiable[tablePos].fSendToSock(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].sock, "PLAYER_WITHOUT_STACK;ok#")            
            tbpool.fRemovePlayer(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].idPoolPlayer)
            self.playerPoolAvaiable.remove(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable])
            self.tablePoolAvaiable[tablePos].mtxAddPlayer.release()
            return
        if(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].sitOutNextHand):
            # Send Values for min and max BuyIn         
            self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].sitOut=True           
            tbpool.fRemovePlayer(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].idPoolPlayer)
            self.playerPoolAvaiable.remove(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable])
            self.tablePoolAvaiable[tablePos].mtxAddPlayer.release()
            return
        self.tablePoolAvaiable[tablePos].socks.append(
            self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].sock)
        # escolhe um assento aleatorio dentre os disponiveis.
        self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].pos = random.choice(
            self.tablePoolAvaiable[tablePos].emptySeats)
            
        logger.fPrintAndLog("enviando jogador %s para mesa com Id %s na pos %s" % (
            self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].name, self.tablePoolAvaiable[tablePos].tableId, self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].pos))
        self.dictPlayerIDtoTableId[self.playerPoolAvaiable[indexOnPlayerPoolAvaiable]
                                   .idPoolPlayer] = self.tablePoolAvaiable[tablePos].tableId
        logger.fPrintAndLog("jogador %s mapeado para mesa %s" % (
            self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].idPoolPlayer, self.tablePoolAvaiable[tablePos].tableId))
        # if self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].balance < self.tablePoolAvaiable[tablePos].minBuyIn:
        #     # faz rebuy automatico toda vez que ficar com menos fichas que o minimo(para fins de teste.)
        #     currentStack = tbuser.fGetBalance(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].idPlayer)
        #     if(float(self.tablePoolAvaiable[tablePos].minBuyIn - self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].balance) > currentStack):
        #         tbuser.fUpdateStack(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].idPlayer, (float(currentStack) * -1) )
        #         self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].balance = self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].balance + currentStack
        #     else:
        #         tbuser.fUpdateStack(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].idPlayer, self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].balance - self.tablePoolAvaiable[tablePos].minBuyIn)
        #         self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].balance = self.tablePoolAvaiable[tablePos].minBuyIn
        self.tablePoolAvaiable[tablePos].fSit(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable],
                                              self.playerPoolAvaiable[indexOnPlayerPoolAvaiable].pos)
        self.playerPoolAvaiable.remove(self.playerPoolAvaiable[indexOnPlayerPoolAvaiable])
        self.tablePoolAvaiable[tablePos].mtxAddPlayer.release()

    def fStartNewHand(self, table):
        #TODO Alexander: Verificar se esta correto essa ordem, visto que uma vez que a mesa inicia ela pode sair do poolAvailable
        self.tablePoolAvaiable.remove(table)
        if not table.fNewHand():
            self.tablePoolAvaiable.append(table)

    def fPlayerIsInPool(self, idPlayer, players):
        for p in players:
            if not p is None:
                if p.idPlayer == idPlayer:
                    return True
        return False
    def fAddNewTable(self):
        logger.fPrintAndLog("adding new table", logMethod="INFO")
        idTablePool = -1
        # TODO isso daqui vai dar erro da forma que esta
        for i in range(len(self.tablePool)):
            if self.tablePool[i] is None:
                idTablePool = i
                break
        if idTablePool == -1:
            self.tablePool.append(None)
            idTablePool = len(self.tablePool)-1
        self.tablePoolAvaiable.append(cTable(idTablePool, eGameTypes.Texas, eBetLimits.NoLimit, 6, 1, 2, minBuyIn=100, maxBuyIn=1000, pool=self.pool))
        self.tablePool[idTablePool] = self.tablePoolAvaiable[len(self.tablePoolAvaiable) - 1]

    def run(self):
        logger.fPrintAndLog("iniciando thread organizer", logMethod="INFO")
        while (True):
            time.sleep(0.5)
            while len(self.playerPoolAvaiable) > 0:
                if len(self.tablePoolAvaiable) == 0:
                    self.fAddNewTable()
                    self.pool.tbpool.fUpdatePlayer(self.playerPoolAvaiable[0].idPoolPlayer, self.playerPoolAvaiable[0].balance , "Entrou na mesa " + str(len(self.tablePoolAvaiable) - 1))
                    self.fAddPlayerToTable(self.playerPoolAvaiable[0].idPoolPlayer, len(self.tablePoolAvaiable) - 1)                    
                    continue
                self.tablePos = 0
                # coloca o primeiro jogador da fila na mesa que tiver jogadores esperando ou na primeira mesa disponivel
                for table in self.tablePoolAvaiable:
                    if not self.fPlayerIsInPool(self.playerPoolAvaiable[0].idPlayer, table.players) and table.currentNumPlayersOnTable < 6 and not table.handIsBeingPlayed:
                        if not table.mtxAddPlayer.locked():
                            table.mtxAddPlayer.acquire()
                            # if not self.tablePoolAvaiable[j].handIsBeingPlayed:
                            logger.fPrintAndLog("verificando mesa %s para adicionar jogador %s" % (table.tableId, self.playerPoolAvaiable[0].name))
                            self.pool.tbpool.fUpdatePlayer(self.playerPoolAvaiable[0].idPoolPlayer, self.playerPoolAvaiable[0].balance , "Entrou na mesa " + str(self.tablePoolAvaiable.index(table)))
                            self.fAddPlayerToTable(self.playerPoolAvaiable[0].idPoolPlayer, self.tablePoolAvaiable.index(table))
                            break
                else:
                    self.fAddNewTable()
                    self.pool.tbpool.fUpdatePlayer(self.playerPoolAvaiable[0].idPoolPlayer, self.playerPoolAvaiable[0].balance , "Entrou na mesa " + str(len(self.tablePoolAvaiable) - 1))
                    self.fAddPlayerToTable(self.playerPoolAvaiable[0].idPoolPlayer, len(self.tablePoolAvaiable) - 1)
                    continue            
            for table in self.tablePoolAvaiable:
                for p in table.players:
                    if p is not None:
                        if p.sitOutNextHand:
                            p.sitOut = True
                            table.currentNumPlayersOnTable -= 1
                            table.players[p.pos] = None
                            table.socks.remove(p.sock)
                            table.emptySeats.append(p.pos)
                            self.conn.fSend(p.sock, "CLEAR_TABLE#")
                if (table.currentNumPlayersOnTable > 1 and (len(table.emptySeats) == 0 or time.time() - table.createTime > 5)):
                    self.fStartNewHand(table)
                    # self.tablePool[0].fNewHand(self.pool)
            #logger.fPrintAndLog("jogadores na pool : %s" % len(self.pool.playerPool), logMethod="INFO")
            #logger.fPrintAndLog("jogadores na disponiveis na pool : %s" % len(self.pool.playerPoolAvaiable), logMethod="INFO")


class cPool():
    def __init__(self, idTipo, idBlind, idQtdJogadores):
        self.tbpool: ctbPool = ctbPool()
        rpool = self.tbpool.fGetPool(idTipo, idBlind, idQtdJogadores)
        self.idPool: int 
        if(len(rpool)>0):
            self.idPool = rpool[0]['idPool']
        else:
            self.idPool = self.tbpool.fCreatePool(idTipo, idBlind, idQtdJogadores)
        self.tbpool.fClearPool(self.idPool)
        self.playerPool = []
        self.playerPoolNames = []
        self.playerPoolAvaiable = []
        self.tablePool: cTable = []
        #self.socks = []
        self.dictPlayerIDtoTableId = {}
        self.tablePoolAvaiable: cTable = []
        self.conn = cConnection(False)
        self.PoolOrganizer = ThPoolOrganizer(self)

    def fEnterPool(self, player: cPlayer, stack):
        logger.fPrintAndLog("Entrando na pool")
        if player.isMarkedToExit:
            logger.fPrintAndLog("Marcado para sair")
            self.tbpool.fRemovePlayer(player.idPoolPlayer)
            tbuser.fUpdateStack(player.idPlayer, player.balance)
            logger.fPrintAndLog("Devolvendo stack do jogador: %s Stack: %s" %
                            (player.name, player.balance), logMethod="INFO")
            #self.dictPlayerIDtoTableId.remove(player.idPoolPlayer)
            player = None
            return
        player.balance = float(stack)
        if player.idPlayer not in self.playerPool:
            self.playerPool.append(player.idPlayer)
            # TODO isso aqui vai dar erro quando o jogador puder sair da pool
        if(player.idPoolPlayer == -1):
            player.idPoolPlayer = self.tbpool.fPutPlayer(self.idPool, player.idPlayer,
                                stack, player.qtdHandsBigBlind)
            logger.fPrintAndLog("Removendo stack do jogador: %s Stack: %s" %
                            (player.name, stack), logMethod="INFO")
            tbuser.fUpdateStack(player.idPlayer, (float(stack) * -1))
        else:
            self.tbpool.fUpdatePlayer(player.idPoolPlayer, stack, "EnterPool")
            # setta o id desse jogador dentro da pool
            # player.idPoolPlayer = len(self.playerPool)
        logger.fPrintAndLog("idPoolPlayer = " + str(player.idPoolPlayer))
        if player not in self.playerPoolAvaiable:
            self.playerPoolAvaiable.append(player)
        else:
            # criar duplicacao do jogador
            pass
        logger.fPrintAndLog("%s entrou na pool com %s de stack" %
                            (player.name, stack), logMethod="INFO")
        playersInPool = "Players In Pool \n"
        for p in self.playerPoolAvaiable:
            playersInPool = playersInPool + p.name + "; stack: " + str(p.balance) + "; Sock: " + str(p.sock.fileno()) + " rAddr: " + str(p.sock.getpeername()) + "\n"
        logger.fPrintAndLog(playersInPool, logMethod="INFO")
        self.fSendToSock(player.sock, 'ENTER_POOL;ok#')
        # self.fSendToAll('PLAYER_POOL;' + str(self.playerPoolNames) + '#')
        # if player.name not in self.playerPoolNames:
        #     self.playerPoolNames.append(player.name)
        # logger.fPrintAndLog(self.playerPoolNames, logMethod="INFO")
        return

    def fMakeAction(self, pool, msg, player):
        tm = thTable(pool, msg, player)
        tm.start()

    def fSendToAll(self, message: str):
        ''' Envia mensagem para todos os Sockets '''
        for p in self.playerPool:
            self.conn.fSend(p.sock, message)

    def fSendToSock(self, sock, message: str):
        ''' Envia mensagem para socket '''
        if(sock is not None):
            self.conn.fSend(sock, message)


# def
#                 self.tableId = opts[1]
#                for i in range(len(tables)):
#                     if tables[i].tableId == self.tableId:
#                         self.tablePos = i
#                         break
#                 if(self.tablePos == -1):
#                     self.tablePos = len(tables)
#                     t: cTable = cTable(
#                         self.tableId, eGameTypes.Texas, eBetLimits.NoLimit, 10, 1, 2, minBuyIn=100, maxBuyIn=1000)
#                     tables.append(t)
#                 tables[self.tablePos].socks.append(self.sock)
#                 tables[self.tablePos].fSendToSock(
#                     self.sock, "ENTER_TABLE;ok#")
#                 tables[self.tablePos].fSendTable(self.sock)
