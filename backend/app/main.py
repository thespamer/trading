from fastapi import FastAPI
from app.services.market_data_service import MarketDataService
from app.models.market_data import MarketData
from app.routes import orders, market_data, admin
from app.services.order_injector_service import OrderInjectorService
import asyncio
from fastapi.middleware.cors import CORSMiddleware
from app.routes import injection_control

# Criação da aplicação FastAPI
app = FastAPI()

# Adicionar o middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens, substitua por seu domínio se preferir
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)

# Incluir as rotas corretamente
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(market_data.router, prefix="/market-data", tags=["Market Data"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(injection_control.router)

# Iniciar a injeção de ordens quando o aplicativo iniciar
@app.on_event("startup")
async def start_injector():
    asyncio.create_task(OrderInjectorService.inject_orders())

# Incluir papéis no banco de dados de mercado ao iniciar a aplicação
@app.on_event("startup")
async def startup_event():
    await MarketDataService.add_paper(MarketData(symbol="AAPL", price=150.0))
    await MarketDataService.add_paper(MarketData(symbol="GOOGL", price=2800.0))

