import asyncio
from ably import AblyRealtime
import time

async def main():
    ably = AblyRealtime('RxvgkA.K2oxVQ:FZUSNRyQC72l1zYvy3EBd_qg828_SOKiqFmfD_sm8nw')
    await ably.connection.once_async('connected')
    print('Connected to Ably')
    channel = ably.channels.get('quickstart')
    await channel.subscribe("greeting", listener)
    while 1:
        await channel.publish('greeting', 'hello!')
        time.sleep(0.1)



def listener(message):
    print('Received a greeting message in realtime: ' + message.data)


asyncio.run(main())

# import asyncio
# from ably import AblyRealtime

# async def main():
#     ably = AblyRealtime('RxvgkA.K2oxVQ:FZUSNRyQC72l1zYvy3EBd_qg828_SOKiqFmfD_sm8nw')
#     channel = ably.channels.get('your-channel-name')

#     def callback(message):
#         print(f"Received message: {message.data}")

#     await channel.attach_async()
#     channel.subscribe(callback)

#     await asyncio.sleep(60)  # Run for 60 seconds for demo purposes

# asyncio.run(main())
