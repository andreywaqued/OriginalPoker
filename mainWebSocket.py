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

import asyncio
import websockets

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
logger = cLogger("main")

async def fTreatMessage(tablePos:int, msg, player:cPlayer):
        opts = msg.split(";")
        if (opts[0] == "SIT"):
            if len(opts) > 1:
                amountToAdd = opts[1]
            else:
                amountToAdd = 0
            tables[tablePos].fSit(player, int(player.pos),
                       round(float(amountToAdd), 2))
        elif(opts[0] == "REQUEST_BUY"):
            tables[tablePos].fPlayerWantsToRebuy(int(player.pos))
        elif(opts[0] == "SITOUT_NEXT_HAND"):
            if(opts[1] == '0'):
                tables[tablePos].fCancelSitOutNext(int(player.pos))
            else:
                tables[tablePos].fSitOutNextHand(int(player.pos))
        elif(opts[0] == "SITOUT_NEXT_BLIND"):
            if(opts[1] == '0'):
                tables[tablePos].fCancelSitOutNext(int(player.pos))
            else:
                tables[tablePos].fSitOutNextBlind(int(player.pos))
        elif(opts[0] == "WAIT_BIG_BLIND"):
            if not tables[tablePos].isTournament:
                tables[tablePos].fWaitBigBlind(int(player.pos), (opts[1] == '1'))
        elif(opts[0] == "FOLD"):
            tables[tablePos].fFold(player.pos)
        elif(opts[0] == "CALL"):
            tables[tablePos].fCall(player.pos)
        elif(opts[0] == "CHECK"):
            tables[tablePos].fCheck(player.pos)
        elif (opts[0] == "RAISE"):
            if len(opts) > 1:
                amountToRaise = opts[1]
            else:
                amountToRaise = 0
            tables[tablePos].fRaise(player.pos, round(float(amountToRaise), 2))
                   
async def fMain(websocket, path):
    # register(websocket) sends user_event() to websocket
    # await register(websocket)
    tablePos = -1
    tableId = -1
    player: cPlayer = None
    try:
        # await websocket.send(state_event())
        async for message in websocket:
            logger.fPrintAndLog("message: " + str(tablePos) + " " + str(message))
            data = message
            await websocket.send(str(message) + ";ok#")
            if(len(data) == 0):
                if(tablePos != -1):
                    tables[tablePos].socks.remove(websocket)
                    if not player is None:
                        tables[tablePos].fGetOutOfTable(player.pos)
                player = None
                websocket.close()
                return
            msgs = str(data).split("#")
            for msg in msgs:
                opts = msg.split(";")
                if(opts[0] == "SIGN_IN"):
                    player = cPlayer("Player" + opts[1], opts[1])
                    player.sock = websocket
                elif(opts[0] == "ENTER_TABLE"):
                    tableId = opts[1]
                    for i in range(len(tables)):
                        if tables[i].tableId == tableId:
                            tablePos = i
                            break
                    if(tablePos==-1):
                        tablePos = len(tables)
                        t:cTable = cTable(tableId, eGameTypes.Texas, eBetLimits.NoLimit, 10, 1, 2, minBuyIn=100, maxBuyIn=1000) 
                        tables.append(t)
                    tables[tablePos].socks.append(websocket)
                    await tables[tablePos].fSendToSock(websocket, "ENTER_TABLE;ok#")
                    tables[tablePos].fSendTable(websocket)
                elif(opts[0] == "RESERVE_SIT"):
                    # Verifica se o jogador reservou uma posicao valida
                    if(tablePos == -1):
                        websocket.send("RESERVE_SIT;invalid#")
                        continue
                    sitInvalid = False
                    if player in tables[tablePos].players:
                        tables[tablePos].fSendToSock(websocket, "RESERVE_SIT;invalid#")
                        sitInvalid = True
                    for p in tables[tablePos].players:
                        if p is not None:
                            if p.pos == int(opts[1]):
                                tables[tablePos].fSendToSock(
                                    websocket, "RESERVE_SIT;invalid#")
                                sitInvalid = True
                    if not sitInvalid:
                        player.pos = int(opts[1])
                        tables[tablePos].fSit(player, int(opts[1]))
                elif(opts[0] == "QUIT"):
                    if(tablePos != -1):
                        tables[tablePos].fGetOutOfTable(player.pos)
                        tables[tablePos].socks.remove(websocket)
                    player = None
                    return
                else:
                    if(tablePos == -1 and len(opts[0]) > 1):
                        websocket.send(str(opts[0]) + ";invalid#")
                        continue
                    await fTreatMessage(tablePos, msg, player)
    finally:
        logger.fPrintAndLog("saiu")
        # await unregister(websocket)

tables:cTable = []
start_server = websockets.serve(fMain, "localhost", 6789)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

# player1 = cPlayer('Alexander', 1,1,1000)
# player2 = cPlayer('Andersen', 2,2,1000)
# # player3 = cPlayer('Andrey', 3,3,1000)

# table = cTable(eGameTypes.Texas, eBetLimits.NoLimit, 9, 1, 2, 100, 1000)
# table.fSit(player1, 1)
# table.fSit(player2, 2)
# # table.fSit(player3, 3)
