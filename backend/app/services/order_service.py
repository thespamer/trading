from app.models.order import Order
from typing import Dict, List

# Simulando um banco de dados em memória
orders_db: Dict[int, Order] = {}
order_counter = 1

class OrderService:
    @staticmethod
    async def create_order(order: Order):
        global order_counter
        order.id = order_counter
        orders_db[order_counter] = order
        order_counter += 1
        return {"status": "Ordem criada", "order_id": order.id}

    @staticmethod
    async def get_order(order_id: int):
        order = orders_db.get(order_id)
        if order:
            return order
        else:
            return {"error": "Ordem não encontrada"}

    @staticmethod
    def get_all_orders() -> List[Order]:
        # Retorna todas as ordens armazenadas no orders_db
        return list(orders_db.values())

