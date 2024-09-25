
# Trading System

This project is a trading system that allows managing assets, injecting random buy/sell orders, and displaying real-time market data.

## Features
- **Asset Management**: Create and update assets with market values.
- **Random Order Injection**: Automatically generate buy and sell orders to enrich the market data.
- **Real-time Market Data**: An endpoint to provide real-time market data to clients.

## How to Run the System

1. Clone the repository and navigate to the project directory.
2. Use Docker Compose to start the application:

```bash
docker-compose up --build
```

The system will start both the backend and frontend. The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

## Admin Routes for Asset Management (/admin)

### Create a new asset

To create a new asset, make a **POST** request to the `/admin/papers` endpoint:

- **Endpoint**: `POST /admin/papers`
- **Body (JSON)**:
```json
{
  "symbol": "JROS",
  "price": 10.0
}
```

### Update the value of an asset

To update the value of an existing asset, make a **PUT** request to the `/admin/papers/{symbol}` endpoint:

- **Endpoint**: `PUT /admin/papers/{symbol}`
- **Body (JSON)**:
```json
{
  "price": 19.0
}
```

### Example Usage with `curl`:

Create an asset:
```bash
curl -X POST "http://localhost:8000/admin/papers" -H "Content-Type: application/json" -d '{"symbol": "JROS", "price": 10.0}'
```

Update an asset's price:
```bash
curl -X PUT "http://localhost:8000/admin/papers/JROS" -H "Content-Type: application/json" -d '{"price": 19.0}'
```

## Random Order Injector

The system is configured to automatically inject random buy and sell orders every 5 seconds. When the system starts, the **OrderInjectorService** will begin generating random buy and sell orders for the registered assets.

You don't need to manually interact with the injector; it runs automatically on system startup.

## Retrieve Real-time Market Data

You can retrieve real-time market data by making a **GET** request to the `/market-data` endpoint:

- **Endpoint**: `GET /market-data`

### Example Usage with `curl`:

```bash
curl -X GET "http://localhost:8000/market-data"
```

This will return the available assets with their current market prices, allowing real-time visualization in the frontend.

## Frontend (Chart and Order Book)

The frontend will display:
- **Trading Chart** with real-time updated asset prices.
- **Order Book** showing the generated buy and sell orders.

Access the frontend at `http://localhost:3000`.
