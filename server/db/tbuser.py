from server.db.db import cDB
from multipledispatch import dispatch


class ctbUser:
    def __init__(self):
        self.db = cDB()

    @dispatch(int)
    def fGetUser(self, id: int):
        return self.db.fConsulta("SELECT * FROM tbuser WHERE idUser = %s", (id, ))

    @dispatch(str)
    def fGetUser(self, usuario: str):
        return self.db.fConsulta("SELECT * FROM tbuser WHERE Usuario = %s", (usuario, ))

    def fAuthenticate(self, usuario: str, senha: str):
        if(self.db.fGetVar("SELECT Count(*) FROM tbuser WHERE Usuario = %s AND Senha = MD5(%s)", (usuario, senha)) == 1):
            return True
        else:
            return False
            
    def fUpdateStack(self, id: int, stack: float):
        return self.db.fExecute("UPDATE tbuser SET SaldoMoeda = ROUND((SaldoMoeda + %s), 2) WHERE idUser = %s", (stack, id))

    def fGetBalance(self, id: int):
        return self.db.fGetVar("SELECT SaldoMoeda FROM tbuser WHERE idUser = %s", (id, ))