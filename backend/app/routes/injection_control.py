from fastapi import APIRouter
from app.services.order_injector_service import OrderInjectorService
import asyncio

# Adicionar as rotas de controle de injeção
router = APIRouter()

# Endpoint para parar a injeção de ordens
@router.post("/stop-order-injection")
async def stop_order_injection():
    global injecting_orders
    injecting_orders = False
    return {"message": "Order injection has been stopped"}

# Endpoint para iniciar a injeção de ordens (opcional)
@router.post("/start-order-injection")
async def start_order_injection():
    global injecting_orders
    injecting_orders = True
    asyncio.create_task(OrderInjectorService.inject_orders())
    return {"message": "Order injection has been started"}

