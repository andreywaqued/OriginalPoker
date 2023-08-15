from django.contrib import admin
from .models import User, TableType, GameVariant, Table, SeatedPlayer, TransactionDepositWithdraw, TransactionTransfer, TransactionTable

# Register your models here.
admin.site.register(User)
admin.site.register(TableType)
admin.site.register(GameVariant)
admin.site.register(Table)
admin.site.register(SeatedPlayer)
admin.site.register(TransactionDepositWithdraw)
admin.site.register(TransactionTransfer)
admin.site.register(TransactionTable)