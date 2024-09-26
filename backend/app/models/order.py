
from pydantic import BaseModel, Field
from enum import Enum

class OrderType(str, Enum):
    market = "market"
    limit = "limit"
    stop = "stop"

class Side(str, Enum):
    buy = "buy"
    sell = "sell"

class Order(BaseModel):
    id: int = Field(default=None, example=1)
    symbol: str = Field(..., example="PETR4")
    quantity: int = Field(..., example=100)
    price: float = Field(default=None, example=28.50)
    order_type: OrderType = Field(..., example=OrderType.market)
    side: Side = Field(..., example=Side.buy)
    