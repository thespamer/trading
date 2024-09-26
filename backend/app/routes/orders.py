from fastapi import APIRouter
from app.models.order import Order
from app.services.order_service import OrderService

router = APIRouter()

@router.post("/")
async def create_order(order: Order):
    result = await OrderService.create_order(order)
    return result

@router.get("/{order_id}")
async def get_order(order_id: int):
    result = await OrderService.get_order(order_id)
    return result

@router.get("/")  # Corrigir a rota para não duplicar o prefixo
async def list_orders():
    return OrderService.get_all_orders()

