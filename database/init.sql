
-- database/init.sql

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    price NUMERIC(10, 2),
    order_type VARCHAR(10) NOT NULL,
    side VARCHAR(4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE market_data (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    volume INT NOT NULL,
    timestamp TIMESTAMP NOT NULL
);
