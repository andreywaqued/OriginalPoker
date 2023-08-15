import socket
import traceback
import logging
from server.logger import cLogger
# The Server listen for connections.
host = ''
port = 50000
logger = cLogger("connection")

# cLogger.fPrintAndLog("Starting Original Poker Servers...")
# s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# cLogger.fPrintAndLog("Binding...")
# s.bind((host, port))
# cLogger.fPrintAndLog("Listening...")
# s.listen(1)
# cLogger.fPrintAndLog("Ready...")
# conn, addr = s.accept()
# cLogger.fPrintAndLog("To-Accept...")
# while True: # Keeps listening until you shutdown the server.
#     cLogger.fPrintAndLog("Running...")
#     data = conn.recv(1024)
#     cLogger.fPrintAndLog(data)
#     if not data:
#         break
#     conn.sendall(data)
# conn.close() # Closes connection when server stops.


class cConnection():
    sock = False
    addr = 0

    def __init__(self, OpenConnection: bool = True):
        if(OpenConnection):
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            logger.fPrintAndLog("Binding...")
            self.sock.bind((host, port))
            logger.fPrintAndLog("Listening...")
            self.sock.listen()
        else:
            self.sock = False

    def fWaitConnect(self):
        logger.fPrintAndLog("Ready...")
        s, a = self.sock.accept()
        return s, a
        # toDo

    def fSend(self, sock: socket, msg: str):
        try:
            logger.fPrintAndLog("Sock: " + str(sock.fileno()) +
                            " rAddr: " + str(sock.getpeername()) + " Send: " + msg)
            sock.send(msg.encode())
            return True
        except Exception as e:
            logger.fPrintAndLog(e)
            logging.error(traceback.format_exc())
            return False

    def fRead(self, sock: socket):
        # toDo
        # return Message from sock
        # Wait Until message came
        try:
            data = sock.recv(1024).decode()
        except Exception as e:
            logger.fPrintAndLog(e)
            logging.error(traceback.format_exc())
            data = ""
        return data
