# # Django specific settings
# import os

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "original_poker.settings")

# # Ensure settings are read
# from django.core.wsgi import get_wsgi_application
# application = get_wsgi_application()

# # Your application specific imports
# from website.models import Table
# #Add user
# t = Table(tableType="Mesa de Teste 010")
# t.save()

# toDo
# Wait For New Connection
# Wait For Table Choice
# Validate table Choice
# Connect New Socket to Table

import socket
import subprocess
import shlex
from server.evaluate import cEval
from server.table import cTable
from server.player import cPlayer
from server.enumerates import eGameTypes, eBetLimits
from server.connection import cConnection
from threading import Thread
from server.logger import cLogger
from server.pool import cPool
from server.db.tbuser import ctbUser
from server.db.tbpool import ctbPool
import time
logger = cLogger("main")
tbuser: ctbUser = ctbUser()
tbpool: ctbPool = ctbPool()

class thTimer(Thread):
    """
        The timer thread class. it receives the table object as a parameter to act over it. \n
        It starts a thread that runs over an array of timers, use setTimer() to insert a timer into the array
    """

    def __init__(self, c: cConnection, s: socket, i: int):
        self.conn = c
        self.sock = s
        self.idPlayer = i
        Thread.__init__(self)
        self.start()
        self.runFunction = True
        self.runThread:bool = True


    def run(self):
        initialTime = time.time()
        logger.fPrintAndLog("Iniciou thread timer do lobby")
        currentBalance = 0 
        try:
            while (self.runThread):
            # wait for actions and count the timer.
                elapsedTime = time.time() - initialTime
                if currentBalance != tbuser.fGetBalance(self.idPlayer):
                    currentBalance = tbuser.fGetBalance(self.idPlayer)
                    self.runFunction = True
                if elapsedTime >= 10 or self.runFunction:
                    self.runFunction = False
                    logger.fPrintAndLog("thread timer passou if")
                    initialTime = time.time()
                    if not self.conn.fSend(self.sock, "SEND_BALANCE;ok;" + str(tbuser.fGetBalance(self.idPlayer)) + "#"):
                        self.runThread = False
                    idsPool = tbpool.fGetPoolIds()
                    for i in range(len(idsPool)):
                        logger.fPrintAndLog("SETTING POOL ID: " + str(i))
                        self.conn.fSend(self.sock, "SET_POOL_PLAYERS;ok;" + str(idsPool[i]['idPool']) + ";" + str(tbpool.fGetPlayerPool(idsPool[i]['idPool'])) + "#")
                time.sleep(1)
        except Exception as e:
            logger.fPrintAndLog('Saiu Thread')

class Th(Thread):
    def __init__(self, c: cConnection, s: socket, a):
        Thread.__init__(self)
        self.conn = c
        self.sock = s
        self.addr = a
        self.tableId: int = -1
        self.tablePos: int = -1
        self.timer:thTimer = None

    def run(self):
        player: cPlayer = None
        try:
            while (True):
                logger.fPrintAndLog("Sock: " + str(self.sock.fileno()) + " rAddr: " +
                                    str(self.sock.getpeername()) + " Aguardando Mensagem ")
                data = self.conn.fRead(self.sock)
                logger.fPrintAndLog("Sock: " + str(self.sock.fileno()) + " rAddr: " +
                                    str(self.sock.getpeername()) + " Read: " + str(data))

                if(len(data) == 0):
                    if(self.tablePos != -1):
                        pool[player.posPool].tablePool[self.tablePos].socks.remove(self.sock)
                        if not player is None:
                            pool[player.posPool].tablePool[self.tablePos].fGetOutOfTable(player.pos)
                    player = None
                    logger.fPrintAndLog(
                        "Sock: " + str(self.sock.fileno()) + " SocketClosed")
                    self.sock.close()
                    return
                msgs = str(data).split("#")
                for msg in msgs:
                    opts = msg.split(";")
                    if(opts[0] == "SIGN_IN"):
                        if(not tbuser.fAuthenticate(opts[1],opts[2])):
                            self.conn.fSend(self.sock, "SIGN_IN;failed#")
                            continue
                        user=tbuser.fGetUser(opts[1])
                        logger.fPrintAndLog(str(user[0]['idUser']) + " - " + user[0]['Nome'])
                        player = cPlayer(user[0]['Nome'], user[0]['idUser'])
                        # player.idAvatar = user[0]['idAvatar']
                        player.idAvatar = 0
                        player.sock = self.sock
                        self.conn.fSend(player.sock, "SIGN_IN;ok;" + str(user[0]['Nome']) + "#")
                        self.conn.fSend(player.sock, "SEND_BALANCE;ok;" + str(tbuser.fGetBalance(player.idPlayer)) + "#")
                        self.conn.fSend(player.sock, "SET_PLAYER_INFO;ok;" + str(user[0]['Nome']) + ";" + str(player.idAvatar) + "#")
                        self.timer = thTimer(self.conn, self.sock, player.idPlayer)
                        
                    elif(opts[0] == "SUBSCRIBE_HASH"):
                        player = cPlayer(opts[1], opts[2])
                        player.sock = self.sock
                        player.idAvatar = opts[3]
                        player.balance = float(opts[7])
                        self.conn.fSend(player.sock, "SUBSCRIBE_HASH;ok#")
                        idPool = tbpool.fGetPool(int(opts[4]),int(opts[5]),int(opts[6]))
                        if(len(idPool) == 0):
                            tbpool.fCreatePool(int(opts[4]),int(opts[5]),int(opts[6]))
                            idPool = tbpool.fGetPool(int(opts[4]),int(opts[5]),int(opts[6]))
                        posPool = -1
                        for i in range(len(pool)):
                            if(pool[i].idPool == idPool[0]['idPool']):
                                posPool = i
                        if(posPool==-1):
                            poolTemp = cPool(int(opts[4]),int(opts[5]),int(opts[6]))
                            poolTemp.idPool = idPool[0]['idPool']
                            pool.append(poolTemp)
                            posPool = len(pool) - 1 
                        player.posPool=posPool
                        logger.fPrintAndLog(
                            'Entrou no posPool %s' % posPool, 'DEBUG')
                        pool[posPool].fEnterPool(player, opts[7])  # player e stack
                    elif (opts[0] == "ENTER_POOL"):
                        logger.fPrintAndLog("ENTER_POOL: opts " + opts[1])
                        pool[player.posPool].fEnterPool(player, opts[1])  # player e stack
                        continue
                    elif (opts[0] == "SUBSCRIBE_POOL"):
                        logger.fPrintAndLog("SUBSCRIBE_POOL: ")
                        logger.fPrintAndLog(opts)
                        currentStack = tbuser.fGetBalance(player.idPlayer)
                        if(float(opts[4]) > currentStack):
                            opts[4]=str(currentStack)
                        if(float(opts[4]) < 100):
                            logger.fPrintAndLog("Stack insulficiente Jogador: %s Stack: %s StackToEnterPool: %s" %
                                            (player.name, currentStack, player.balance), logMethod="INFO")
                            self.conn.fSend(player.sock, 'SUBSCRIBE_POOL;insulficientfunds#')
                        else:
                            self.conn.fSend(player.sock, "SUBSCRIBE_POOL;ok;" + player.name + ":" + str(player.idPlayer) + ":" + str(player.idAvatar) + ":" + opts[1] + ":" + opts[2] + ":" + opts[3] + ":" + opts[4] + "#")
                            self.conn.fSend(player.sock, "SEND_BALANCE;ok;" + str(tbuser.fGetBalance(player.idPlayer)) + "#")
                        continue
                    elif (opts[0] == "GET_BALANCE"):
                        logger.fPrintAndLog("GET_BALANCE:")
                        logger.fPrintAndLog(opts)
                        self.conn.fSend(player.sock, "SEND_BALANCE;ok;" + str(tbuser.fGetBalance(player.idPlayer)) + "#")
                        continue
                    elif (opts[0] == "GET_CASHIER"):
                        logger.fPrintAndLog("GET_CASHIER:")
                        logger.fPrintAndLog(opts)
                        user=tbuser.fGetUser(player.idPlayer)
                        player.idAvatar = user[0]['idAvatar']
                        bal = tbuser.fGetBalance(player.idPlayer)
                        # if (bal < 1000):
                        #     tbuser.fUpdateStack(player.idPlayer, 1000)
                        self.conn.fSend(player.sock, "SEND_CASHIER;ok;" + str(bal) + ";" + str(tbpool.fGetPlayerBalanceInPlay(player.idPlayer)) + "#")
                        self.conn.fSend(player.sock, "SEND_BALANCE;ok;" + str(bal) + "#")
                        self.conn.fSend(player.sock, "SET_PLAYER_INFO;ok;" + str(user[0]['Nome']) + ";" + str(player.idAvatar) + "#")
                        continue
                    elif (opts[0] == "GET_LOBBY"):
                        logger.fPrintAndLog("GET_LOBBY:")
                        logger.fPrintAndLog(opts)
                        user=tbuser.fGetUser(player.idPlayer)
                        player.idAvatar = user[0]['idAvatar']
                        self.timer.runFunction = True
                        self.conn.fSend(player.sock, "SEND_LOBBY;ok;#")
                        self.conn.fSend(player.sock, "SET_PLAYER_INFO;ok;" + str(user[0]['Nome']) + ";" + str(player.idAvatar) + "#")
                        self.conn.fSend(player.sock, "SEND_BALANCE;ok;" + str(tbuser.fGetBalance(player.idPlayer)) + "#")
                        continue
                    elif(opts[0] == "ENTER_TABLE"):
                        self.tableId = opts[1]
                        for i in range(len(tables)):
                            if tables[i].tableId == self.tableId:
                                self.tablePos = i
                                break
                        if(self.tablePos == -1):
                            self.tablePos = len(tables)
                            t: cTable = cTable(
                                self.tableId, eGameTypes.Texas, eBetLimits.NoLimit, 10, 1, 2, minBuyIn=100, maxBuyIn=1000)
                            tables.append(t)
                        tables[self.tablePos].socks.append(self.sock)
                        tables[self.tablePos].fSendToSock(
                            self.sock, "ENTER_TABLE;ok#")
                        self.conn.fSend(player.sock, "SEND_BALANCE;ok;" + str(tbuser.fGetBalance(player.idPlayer)) + "#")
                        # tables[self.tablePos].fSendTable(self.sock)
                    elif(opts[0] == "RESERVE_SIT"):
                        # Verifica se o jogador reservou uma posicao valida
                        if(self.tablePos == -1):
                            self.conn.fSend(self.sock, "RESERVE_SIT;invalid#")
                            continue
                        sitInvalid = False
                        if player in tables[self.tablePos].players:
                            tables[self.tablePos].fSendToSock(
                                self.sock, "RESERVE_SIT;invalid#")
                            sitInvalid = True
                        for p in tables[self.tablePos].players:
                            if p is not None:
                                if p.pos == int(opts[1]):
                                    tables[self.tablePos].fSendToSock(
                                        self.sock, "RESERVE_SIT;invalid#")
                                    sitInvalid = True
                        if not sitInvalid:
                            player.pos = int(opts[1])
                            tables[self.tablePos].fSit(player, int(opts[1]))
                    elif(opts[0] == "QUIT"):
                        if(opts[1] == "notfunds"):
                            self.conn.fSend(player.sock, "QUIT;ok;")
                            self.sock.shutdown(socket.SHUT_RDWR)
                            self.sock.close()
                            return
                        else:
                            if(player.posPool != -1):
                                player.isMarkedToExit = True
                                curPool:cPool = pool[player.posPool]
                                tpos = curPool.dictPlayerIDtoTableId[player.idPoolPlayer]
                                curTable:cTable = curPool.tablePool[tpos]
                                if not curTable.handIsBeingPlayed :
                                    curTable.fGetBackToPool(player)
                                    curPool.tablePoolAvaiable.remove(curTable)
                                    curPool.tablePool[tpos].playersAskedToRebuy == []
                                    curPool.tablePool[tpos].handIsBeingPlayed = False
                                    curPool.tablePool[tpos] = None
                            else:
                                self.timer.runThread = False
                                self.timer.join()
                            self.conn.fSend(player.sock, "QUIT;ok;")
                            self.sock.shutdown(socket.SHUT_RDWR)
                            self.sock.close()
                            return
                    elif(opts[0] == ""):
                        logger.fPrintAndLog(
                            'entrou para fazer acao vazia %s' % opts[0], 'DEBUG')
                    else:
                        # if(self.tablePos == -1 and len(opts[0]) > 1):
                        #    self.conn.fSend(self.sock, opts[0] + ";invalid#")
                        #    continue
                        pool[player.posPool].fMakeAction(pool[player.posPool], msg, player)
                        #print('entrou para fazer acao %s' % opts[0])
                        # pass        
        except Exception as e:
            logger.fPrintAndLog(e)
            logger.fPrintAndLog("saiu")

pools = tbpool.fGetPoolPalyers()
for i in range(len(pools)):
    tbuser.fUpdateStack(pools[i]['idJogador'],pools[i]['Stack'])
    tbpool.fRemovePlayer(pools[i]['idPoolPlayer'])

pool:cPool = []
tables: cTable = []
# table = cTable(eGameTypes.Texas, eBetLimits.NoLimit, 10, 1, 2, minBuyIn=100, maxBuyIn=1000)
conn = cConnection(True)
# for i in range(100):
#     print(tbuser.fGetUser(i))
# exit()
while(True):
    logger.fPrintAndLog("Aguardando Conexao: ")
    s, a = conn.fWaitConnect()
    a = Th(conn, s, a)
    a.start()
exit

# player1 = cPlayer('Alexander', 1,1,1000)
# player2 = cPlayer('Andersen', 2,2,1000)
# # player3 = cPlayer('Andrey', 3,3,1000)

# table = cTable(eGameTypes.Texas, eBetLimits.NoLimit, 9, 1, 2, 100, 1000)
# table.fSit(player1, 1)
# table.fSit(player2, 2)
# # table.fSit(player3, 3)
