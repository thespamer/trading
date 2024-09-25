
class StrategyService:
    @staticmethod
    async def run_strategy(strategy_id: int):
        # Simulação da execução de uma estratégia
        return {"status": "Estratégia executada", "strategy_id": strategy_id}

    @staticmethod
    async def list_strategies():
        # Simulação de lista de estratégias
        return [
            {"id": 1, "name": "Estratégia de Momentum"},
            {"id": 2, "name": "Estratégia de Reversão"}
        ]
