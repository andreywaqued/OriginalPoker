from django.db import models

# Create your models here.

# User / Account / Player.
class User(models.Model):
    nickname = models.CharField(max_length=100, null=True, blank=True)
    login = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.CharField(max_length=150)
    full_name = models.CharField(max_length=150, null=True, blank=True)
    is_player = models.BooleanField(default=True)
    is_banned = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    current_amount = models.DecimalField(max_digits=17, decimal_places=2, default=0)

    """ This method Creates a representation (for internal Django usage) of which variable is returned 
    when you print an object. This is also used  through Django's automatically-generated admin. """
    def __str__(self):
        return self.nickname

    # Promotes a user to admin privileges.
    def PromoteToAdmin(self):
        self.is_admin = True
    
    # Revoke admin privileges from a user.
    def RevokeAdmin(self):
        self.is_admin = False

# Table Types (Cash Game, Sit 'n Go, etc...)
class TableType(models.Model):
    type_name = models.CharField(max_length=100)

# The Game Variants (Texas Hold'em, Omaha, etc...)
class GameVariant(models.Model):
    variant_name = models.CharField(max_length=100)

# Open Tables (existing tables)
class Table(models.Model):
    table_type = models.ForeignKey(TableType, on_delete=models.CASCADE)
    game_variant = models.ForeignKey(GameVariant, on_delete=models.CASCADE)
    max_player_count = models.IntegerField(default=0)
    current_player_count = models.IntegerField(default=0)
    seated_players = models.ManyToManyField(
        User,
        through='SeatedPlayer', # This ManyToMany table is further specified in the SeatedPlayer Class.
        through_fields=('table', 'player')
    ) 
    #table_creation_timestamp = models.DateTimeField(auto_now_add=True)
    small_blind = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    big_blind = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    min_buy_in = models.DecimalField(max_digits=15, decimal_places=2, default=0, null=True)
    max_buy_in = models.DecimalField(max_digits=15, decimal_places=2, default=0, null=True)

    """ This method Creates a representation (for internal Django usage) of which variable is returned 
    when you print an object. This is also used  through Django's automatically-generated admin. """
    def __str__(self):
        return self.table_type

# Players currently sitting on a certain table.
class SeatedPlayer(models.Model):
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=17, decimal_places=2, default=0)
    position = models.IntegerField(null=True)

# Transactions that Users make with our company (deposit and withdraw of amounts)
class TransactionDepositWithdraw(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=17, decimal_places=2, default=0)
    transaction_timestamp = models.DateTimeField(auto_now_add=True)

# Transactions made between players.
class TransactionTransfer(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiving_user")
    amount = models.DecimalField(max_digits=17, decimal_places=2, default=0)
    transaction_timestamp = models.DateTimeField(auto_now_add=True)

# Transactions saved when player sit and leave a game table.
class TransactionTable(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=17, decimal_places=2, default=0)
    transaction_timestamp = models.DateTimeField(auto_now_add=True)
