
from app.models.market_data import Paper
from typing import Dict
from datetime import datetime

# Banco de dados em memória simulando papéis
market_data_db: Dict[str, Paper] = {}

class MarketDataService:
    @staticmethod
    async def add_paper(paper: Paper):
        paper.timestamp = datetime.utcnow().isoformat()
        market_data_db[paper.symbol] = paper
        return {"status": "Papel criado", "paper": paper}

    @staticmethod
    async def update_paper(symbol: str, price: float):
        if symbol in market_data_db:
            market_data_db[symbol].price = price
            market_data_db[symbol].timestamp = datetime.utcnow().isoformat()
            return {"status": "Papel atualizado", "paper": market_data_db[symbol]}
        else:
            return {"error": "Papel não encontrado"}
