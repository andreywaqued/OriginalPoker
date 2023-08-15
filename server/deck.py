import random
from server.card import cCard
#importar de server.card
class cDeck:
    def __init__(self):
        self.deck=[]
        self.deck.append( cCard('2s'))
        self.deck.append( cCard('3s'))
        self.deck.append( cCard('4s'))
        self.deck.append( cCard('5s'))
        self.deck.append( cCard('6s'))
        self.deck.append( cCard('7s'))
        self.deck.append( cCard('8s'))
        self.deck.append( cCard('9s'))
        self.deck.append( cCard('Ts'))
        self.deck.append( cCard('Js'))
        self.deck.append( cCard('Qs'))
        self.deck.append( cCard('Ks'))
        self.deck.append( cCard('As'))

        self.deck.append( cCard('2d'))
        self.deck.append( cCard('3d'))
        self.deck.append( cCard('4d'))
        self.deck.append( cCard('5d'))
        self.deck.append( cCard('6d'))
        self.deck.append( cCard('7d'))
        self.deck.append( cCard('8d'))
        self.deck.append( cCard('9d'))
        self.deck.append( cCard('Td'))
        self.deck.append( cCard('Jd'))
        self.deck.append( cCard('Qd'))
        self.deck.append( cCard('Kd'))
        self.deck.append( cCard('Ad'))

        self.deck.append( cCard('2c'))
        self.deck.append( cCard('3c'))
        self.deck.append( cCard('4c'))
        self.deck.append( cCard('5c'))
        self.deck.append( cCard('6c'))
        self.deck.append( cCard('7c'))
        self.deck.append( cCard('8c'))
        self.deck.append( cCard('9c'))
        self.deck.append( cCard('Tc'))
        self.deck.append( cCard('Jc'))
        self.deck.append( cCard('Qc'))
        self.deck.append( cCard('Kc'))
        self.deck.append( cCard('Ac'))

        self.deck.append( cCard('2h'))
        self.deck.append( cCard('3h'))
        self.deck.append( cCard('4h'))
        self.deck.append( cCard('5h'))
        self.deck.append( cCard('6h'))
        self.deck.append( cCard('7h'))
        self.deck.append( cCard('8h'))
        self.deck.append( cCard('9h'))
        self.deck.append( cCard('Th'))
        self.deck.append( cCard('Jh'))
        self.deck.append( cCard('Qh'))
        self.deck.append( cCard('Kh'))
        self.deck.append( cCard('Ah'))

    def fGetCard(self, pos):
        return self.deck[pos].fGetCard()

    def fShuffle(self):
        for _ in range(random.randint(5,10)):
            random.shuffle(self.deck)