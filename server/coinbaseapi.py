from coinbase.wallet.client import Client
import json

api_key='51qgGGBIjMWrLLag'
api_secret='Kyf6BnkYKm1UmBCGVfbpX7UrJF97ao2u'
client = Client(api_key, api_secret)

user = client.get_current_user()
user_as_json_string = json.dumps(user)
print(user_as_json_string)
print(client.get_addresses('BTC'))
print(client.get_sell_price(currency_pair = 'BTC-USD'))
accounts=client.get_accounts()
#address_id = client.create_address('BTC')
#print(address_id)
print(client.get_address_transactions('BTC', '3GHvAquRz7sGJnDQyoe2zspuKz8KmiGexd'))
print(client.get_address_transactions('BTC', 'f62290d1-0e50-5ee8-9a68-52f129d1d568'))
print(client.get_addresses('BTC'))
