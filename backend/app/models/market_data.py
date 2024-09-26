
from pydantic import BaseModel, Field
from typing import Optional

class Paper(BaseModel):
    symbol: str = Field(..., example="JROS")
    price: float = Field(..., example=10.0)
    timestamp: Optional[str] = None  # Campo opcional, gerado no backend

class MarketData(BaseModel):
    symbol: str
    price: float
    timestamp: Optional[str] = None  # Adiciona o campo "timestamp" como opcional
