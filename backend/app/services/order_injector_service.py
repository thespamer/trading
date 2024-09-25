
import random
import asyncio
from app.models.order import Order, OrderType, Side
from app.services.order_service import OrderService
from app.services.market_data_service import market_data_db
import logging

logging.basicConfig(level=logging.INFO)

class OrderInjectorService:
    @staticmethod
    async def inject_orders():
        while True:
            if market_data_db:
                # Selecionar um papel aleatório dentre todos os papéis criados
                symbol = random.choice(list(market_data_db.keys()))
                # Criar uma ordem de compra ou venda aleatória
                order_type = random.choice([OrderType.market, OrderType.limit])
                side = random.choice([Side.buy, Side.sell])
                quantity = random.randint(1, 100)
                price = market_data_db[symbol].price if order_type == OrderType.market else random.uniform(0.9, 1.1) * market_data_db[symbol].price
                
                order = Order(symbol=symbol, quantity=quantity, order_type=order_type, side=side, price=price)
                await OrderService.create_order(order)
                
                # Log para monitorar a criação de ordens
                logging.info(f"New order created for {symbol}: {order}")

            # Esperar 5 segundos antes de gerar a próxima ordem
            await asyncio.sleep(5)
