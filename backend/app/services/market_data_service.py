from pydantic import BaseModel
from typing import Dict, List
from datetime import datetime

# Banco de dados em memória simulando papéis
market_data_db: Dict[str, 'MarketData'] = {}
order_volume: Dict[str, int] = {}  # Simulação de volume de ordens por período

# Definir o modelo MarketData
class MarketData(BaseModel):
    symbol: str
    price: float
    timestamp: str = None  # Adiciona o timestamp para armazenar a data e hora da última atualização

class MarketDataService:
    @staticmethod
    async def add_paper(paper: MarketData):
        paper.timestamp = datetime.utcnow().isoformat()
        market_data_db[paper.symbol] = paper
        return {"status": "Paper created", "paper": paper}

    @staticmethod
    async def update_paper(symbol: str, price: float):
        if symbol in market_data_db:
            market_data_db[symbol].price = price
            market_data_db[symbol].timestamp = datetime.utcnow().isoformat()
            return {"status": "Paper updated", "paper": market_data_db[symbol]}
        else:
            return {"error": "Paper not found"}

    @staticmethod
    def get_all_papers() -> List[MarketData]:
        return list(market_data_db.values())

    @staticmethod
    def get_volume_by_period(start: str, end: str):
        start_time = datetime.fromisoformat(start)
        end_time = datetime.fromisoformat(end)
        volume = 0
        for period, vol in order_volume.items():
            period_time = datetime.fromisoformat(period)
            if start_time <= period_time <= end_time:
                volume += vol
        return volume

