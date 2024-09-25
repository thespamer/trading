
from fastapi import FastAPI
from app.routes import orders, market_data, strategies

app = FastAPI(title="Sistema de Trading")

app.include_router(orders.router, prefix="/orders", tags=["Ordens"])
app.include_router(market_data.router, prefix="/market-data", tags=["Dados de Mercado"])
app.include_router(strategies.router, prefix="/strategies", tags=["Estratégias"])

@app.get("/")
def read_root():
    return {"message": "Bem-vindo ao Backend do Sistema de Trading"}
    