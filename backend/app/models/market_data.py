
from pydantic import BaseModel, Field

class Paper(BaseModel):
    symbol: str = Field(..., example="JROS")
    price: float = Field(..., example=10.0)
    timestamp: str = Field(..., example="2024-10-01T10:00:00Z")
