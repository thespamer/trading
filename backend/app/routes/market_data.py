
from fastapi import APIRouter
from app.services.market_data_service import market_data_db

router = APIRouter()

@router.get("/")
async def get_market_data():
    return list(market_data_db.values())
