
from pydantic import BaseModel, Field

class MarketData(BaseModel):
    symbol: str = Field(..., example="PETR4")
    price: float = Field(..., example=28.50)
    volume: int = Field(..., example=1000)
    timestamp: str = Field(..., example="2023-10-01T10:00:00Z")
