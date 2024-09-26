
from fastapi import APIRouter, HTTPException
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

# Listar todos os papéis e seus valores
@router.get("/papers")
async def list_papers():
    papers = MarketDataService.get_all_papers()
    if not papers:
        raise HTTPException(status_code=404, detail="No papers found")
    return papers

# Endpoint para listar o volume de match de ordens em um período específico
@router.get("/volume/{start}/{end}")
async def get_volume_by_period(start: str, end: str):
    volume = MarketDataService.get_volume_by_period(start, end)
    if volume is None:
        raise HTTPException(status_code=404, detail="No volume data available for the specified period")
    return {"start": start, "end": end, "volume": volume}
