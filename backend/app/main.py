
from fastapi import FastAPI
from app.routes import orders, market_data, admin
from app.services.order_injector_service import OrderInjectorService
import asyncio

app = FastAPI()

@app.on_event("startup")
async def start_injector():
    asyncio.create_task(OrderInjectorService.inject_orders())

app.include_router(orders.router, prefix="/orders", tags=["Ordens"])
app.include_router(market_data.router, prefix="/market-data", tags=["Dados de Mercado"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
