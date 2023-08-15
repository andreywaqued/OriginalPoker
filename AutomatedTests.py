import socket
import random
import time
import sys


class MySocket:
    """demonstration class only
      - coded for clarity, not efficiency
    """

    def __init__(self, sock=None):
        self.MSGLEN = 100
        if sock is None:
            self.sock = socket.socket(
                socket.AF_INET, socket.SOCK_STREAM)
        else:
            self.sock = sock

    def connect(self, host, port):
        self.sock.connect((host, port))

    def fSend(self, msg: str):
        print("Send: " + msg)
        self.sock.send(msg.encode())
        return True

    def fRead(self):
        # toDo
        # return Message from sock
        # Wait Until message came
        data = self.sock.recv(1024).decode()
        return data


sock = MySocket()
if len(sys.argv) > 1:
    host = sys.argv[1]
    if host == "local":
        host = "localhost"
    if host == "alexander":
        host = "192.168.0.103"
        #host = "192.168.61.14"
else:
    host = "3.21.35.87"
    #host = "localhost"
sock.connect(host, 50000)
playerID = random.randrange(100, 200)
playerName = "Player" + str(playerID)
sock.fSend("SIGN_IN;%s;%s#" % (playerName, playerID))
countNewHand = 0
handsToPlay = 10000
#avaiablePositions = []
#maxPlayersOnTable = 6
initialTime = time.time()
sitted = False
# for i in range(maxPlayersOnTable):
#    avaiablePositions.append(i)
while (countNewHand < handsToPlay):
    if countNewHand + 1 == handsToPlay:
        print("ultima mao")
    data = sock.fRead()
    if(len(data) == 0):
        exit()
    msgs = str(data).split("#")
    for msg in msgs:
        print("Read: " + str(msg))
        opts = msg.split(";")
        if(opts[0] == "RESERVE_SIT"):
            if opts[1] == "ok":
                amountToEnterTable = random.randrange(
                    int(opts[2]), int(opts[3]))
                print("Assento reservado")
                sock.fSend("SIT;%s#" % (amountToEnterTable))
            elif opts[1] == "invalid":
                pass
                # print("Assento ja esta em uso")
                # print("Posicoes disponiveis: " + str(avaiablePositions))
                # playerPos = random.choice(avaiablePositions)
                # sock.fSend("RESERVE_SIT;%s#" % playerPos)
            elif not sitted:
                pass
                # print(opts[1])
                # avaiablePositions.remove(int(opts[1]))
        if(opts[0] == "SIGN_IN" and opts[1] == "ok"):
            time.sleep(1)
            print("conectado")
            #print("Posicoes disponiveis: " + str(avaiablePositions))
            #playerPos = random.choice(avaiablePositions)
            # entra sempre na mesa com 100 fichas
            sock.fSend("SUBSCRIBE_POOL;5;1;3;2#")
            # sock.fSend("RESERVE_SIT;%s#" % playerPos)
        elif(opts[0] == "SUBSCRIBE_POOL" and opts[1] == "ok"):
            time.sleep(1)
            print("Aceito no Pool")
            #print("Posicoes disponiveis: " + str(avaiablePositions))
            #playerPos = random.choice(avaiablePositions)
            # entra sempre na mesa com 100 fichas
            optHash = opts[2].split(':')
            #SUBSCRIBE_HASH;Alexander Waqued;8;5;1;3;2
            sock.fSend("SUBSCRIBE_HASH;%s;%s;%s;%s;%s;%s#" % (optHash[0], optHash[1], optHash[2], optHash[3], optHash[4], optHash[5]))
            # sock.fSend("RESERVE_SIT;%s#" % playerPos)
        elif(opts[0] == "SIT"):
            if opts[1] == "ok":
                print("Sentou na mesa")
                playerPos = opts[2]
                sitted = True
            elif opts[1] == "invalid":
                print("Nao sentou na mesa")
                sitted = False
        elif (opts[0] == "SITOUT"):
            if opts[1] == str(playerPos):
                print("ficou sitout")
                # if mystack == 0:
                #     amountToEnterTable = 100
                #     print("Fazendo Rebuy")
                #     sock.fSend("SIT;%s#" % (amountToEnterTable))
                # else:
                sock.fSend("SIT#")
        elif(opts[0] == "RESERVE_SIT" and opts[1] == "ok"):
            amountToEnterTable = random.randrange(int(opts[2]), int(opts[3]))
            print("Assento reservado")
            sock.fSend("SIT;%s#" % (amountToEnterTable))
        elif (opts[0] == "REQUEST_BUY" and len(opts) > 2):
            pass
            # time.sleep(10)
            # amountToEnterTable = random.randrange(int(opts[2]), int(opts[3]))
            # print("Fazendo Rebuy")
            # sock.fSend("SIT;%s#" % (amountToEnterTable))
        elif (opts[0] == "NEW_HAND"):
            countNewHand += 1
        elif(opts[0] == "UPDATE_PLAYER_STACK"):
            if opts[1] == str(playerPos):
                mystack = float(opts[2])
        elif(opts[0] == "PLAYER_TURN" and len(opts) > 2):
            # Usar o codigo comentado para jogar manualmente
            # print("Sua vez de agir, escolha uma das acoes a seguir:")
            # print("Amount To Call: %s" % opts[2])
            # print("MinBet: %s" % opts[3])
            # print("MaxBet: %s" % opts[4])
            # for i in range(5, len(opts)):
            #     print(opts[i])
            # action = input()
            actions = opts[5:]
            print(actions)
            action = random.choice(actions)
            #action = "RAISE"
            print(action)
            if action != "":
                if action == "RAISE":
                    bet = round(random.uniform(
                        float(opts[3]), float(opts[4])), 2)
                    bet = round(float(opts[4]), 2)
                    sock.fSend("%s;%s#" % (action, bet))
                    # sock.fSend("SITOUT_NEXT_HAND;1;0#")
                else:
                    sock.fSend("%s#" % action)
                time.sleep(2)
                print("Actual Time Elapsed: %s" % (time.time() - initialTime))
    # print("Deseja enviar uma nova mensagem?")
    # message = input()
    # if message != "":
    #     sock.fSend(message)
