from server.db.db import cDB
from multipledispatch import dispatch


class ctbPool:
    def __init__(self):
        self.db = cDB()

    @dispatch(int)
    def fGetPool(self, id: int):
        return self.db.fConsulta("SELECT * FROM tbpool WHERE idPool = %s", (id ,))

    @dispatch(int, int, int)
    def fGetPool(self, idTipo: int, idBlind: int, idQtdJogadores: int):
        return self.db.fConsulta("SELECT * FROM tbpool WHERE idTipo = %s AND idBlind = %s AND idQuantidadeJogadores = %s", (idTipo, idBlind, idQtdJogadores))

    def fGetPlayerPool(self, id: int):
        return self.db.fGetVar("SELECT count(*) FROM originaldb.tbpoolplayer WHERE idPool = %s", (id ,))

    def fGetPlayerBalanceInPlay(self, id: int):
        return self.db.fGetVar("SELECT SUM(Stack) FROM originaldb.tbpoolplayer WHERE idJogador = %s;", (id ,))
    
    def fGetPoolIds(self):
        return self.db.fConsulta("SELECT idPool FROM tbpool")

    def fGetPoolPalyers(self):
        return self.db.fConsulta("SELECT * FROM tbpoolplayer")

    def fCreatePool(self, idTipo: int, idBlind: int, idQtdJogadores: int):
        return self.db.fExecute("INSERT INTO tbpool (idTipo, idBlind, idQuantidadeJogadores) VALUES (%s, %s, %s)", (idTipo, idBlind, idQtdJogadores))

    def fPutPlayer(self, idPool: int, idPlayer: int, stack: float, qtdHandsBigBlind: int):
        return self.db.fExecute("INSERT INTO tbpoolplayer (idPool, idJogador, Stack, QtdeHandsBigBlind, DateLastAction) VALUES (%s, %s, %s, %s, NOW())", (idPool, idPlayer, stack, qtdHandsBigBlind))

    def fUpdatePlayer(self, idPoolPlayer: int, stack: float, lastAction: str):
        return self.db.fExecute("UPDATE tbpoolplayer SET Stack = %s , LastAction = %s, DateLastAction = NOW() WHERE idPoolPlayer = %s", (stack,  lastAction,  idPoolPlayer))
    
    def fRemovePlayer(self, idPoolPlayer: int):
        return self.db.fExecute("DELETE FROM tbpoolplayer WHERE idPoolPlayer = %s", (idPoolPlayer, ))

    def fClearPool(self, idPool: int):
        return self.db.fExecute("DELETE FROM tbpoolplayer WHERE idPool = %s", (idPool, ))
