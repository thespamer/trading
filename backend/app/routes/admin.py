
from fastapi import APIRouter
from app.models.market_data import Paper
from app.services.market_data_service import MarketDataService

router = APIRouter()

# Criar um novo papel
@router.post("/papers")
async def create_paper(paper: Paper):
    return await MarketDataService.add_paper(paper)

# Atualizar o valor de um papel
@router.put("/papers/{symbol}")
async def update_paper(symbol: str, price: float):
    return await MarketDataService.update_paper(symbol, price)
