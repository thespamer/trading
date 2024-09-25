
from fastapi import APIRouter
from app.services.market_data_service import MarketDataService

router = APIRouter()

@router.get("/quotes")
async def get_market_quotes():
    quotes = await MarketDataService.get_quotes()
    return quotes

@router.get("/historical/{symbol}")
async def get_historical_data(symbol: str):
    data = await MarketDataService.get_historical_data(symbol)
    return data
