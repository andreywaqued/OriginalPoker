from db import cDB
from multipledispatch import dispatch
import random


class ctbPropaganda:
    def __init__(self):
        self.db = cDB()
        
    def fGetAdd(self, id: int):
        return self.db.fConsulta("SELECT * FROM tbpropaganda WHERE idPropaganda = %s", (id, ))

    @dispatch()
    def fGetRandomAdds(self):
        qtde = self.db.fGetVar("SELECT Count(*) FROM tbpropaganda")
        limit = random.randint(0, qtde-1)
        return self.db.fConsulta("SELECT * FROM tbpropaganda LIMIT %s ,1", (limit, ))

    @dispatch(str)
    def fGetRandomAdds(self, tipo: str):
        qtde = self.db.fGetVar(
            "SELECT Count(*) FROM tbpropaganda WHERE Tipo = %s", (tipo, ))
        if(qtde == 0):
            return []
        limit = random.randint(0, qtde-1)
        return self.db.fConsulta("SELECT * FROM tbpropaganda WHERE Tipo = %s LIMIT %s,1", (tipo, limit))
