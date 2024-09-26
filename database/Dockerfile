
# Database Dockerfile
FROM postgres:13

ENV POSTGRES_USER=trading_user
ENV POSTGRES_PASSWORD=trading_password
ENV POSTGRES_DB=trading_db

COPY init.sql /docker-entrypoint-initdb.d/
