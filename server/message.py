#classe para envio de mensagens para o socket.
class cMessage():
    def __init__(self):
        self.action = ""
        self.message = ""
        self.arguments = []

""" 
Samples action From Client to Server
    login
    openTable
    getTableState
    sit
    action (ação que o jogador fez {Call, Raise, Fold, Check})

Samples action From Server to Client
    tableState
    returnLogin
    returnSit
    returnAction (retorna para o Cliente se a action dele é valida)
    board
    playerToAct 
    playerCards (Envia as cartas e/ou se o jogador tem cartas)
    playerAction (Envia action de um jogador especifico)
"""