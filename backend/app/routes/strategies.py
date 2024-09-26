
from fastapi import APIRouter
from app.services.strategy_service import StrategyService

router = APIRouter()

@router.post("/run/{strategy_id}")
async def run_strategy(strategy_id: int):
    result = await StrategyService.run_strategy(strategy_id)
    return result

@router.get("/")
async def list_strategies():
    strategies = await StrategyService.list_strategies()
    return strategies
