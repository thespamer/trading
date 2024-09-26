
import os

class Config:
    DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://trading_user:trading_password@db:5432/trading_db')
    KAFKA_BROKER_URL = os.getenv('KAFKA_BROKER_URL', 'kafka:9092')
    RABBITMQ_URL = os.getenv('RABBITMQ_URL', 'amqp://guest:guest@rabbitmq:5672/')
    