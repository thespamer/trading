
from app.models.market_data import MarketData

class MarketDataService:
    @staticmethod
    async def get_quotes():
        # Simulação de dados de mercado em tempo real
        return [
            MarketData(symbol="PETR4", price=28.50, volume=1000, timestamp="2023-10-01T10:00:00Z"),
            MarketData(symbol="VALE3", price=75.30, volume=2000, timestamp="2023-10-01T10:00:00Z"),
        ]

    @staticmethod
    async def get_historical_data(symbol: str):
        # Simulação de dados históricos
        return [
            MarketData(symbol=symbol, price=28.00, volume=1500, timestamp="2023-09-30T10:00:00Z"),
            MarketData(symbol=symbol, price=27.80, volume=1200, timestamp="2023-09-29T10:00:00Z"),
        ]
