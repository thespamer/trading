
# Trading System

Este projeto é um sistema de trading que permite gerenciar papéis, injetar ordens de compra/venda aleatórias e exibir dados de mercado em tempo real.

## Funcionalidades
- **Administração de Papéis**: Criação e atualização de papéis (ativos) com valores de mercado.
- **Injeção de Ordens Aleatórias**: Geração automática de ordens de compra e venda para enriquecer os dados de mercado.
- **Dados de Mercado em Tempo Real**: Um endpoint para fornecer os dados de mercado em tempo real.

## Como Subir o Sistema

1. Clone o repositório e navegue até o diretório do projeto.
2. Use o Docker Compose para subir a aplicação:

```bash
docker-compose up --build
```

O sistema irá levantar tanto o backend quanto o frontend. O frontend estará disponível em `http://localhost:3000` e o backend em `http://localhost:8000`.

## Rotas de Administração de Papéis (/admin)

### Criar um novo papel

Para criar um novo papel, faça uma requisição **POST** para o endpoint `/admin/papers`:

- **Endpoint**: `POST /admin/papers`
- **Body (JSON)**:
```json
{
  "symbol": "JROS",
  "price": 10.0
}
```

### Atualizar o valor de um papel

Para atualizar o valor de um papel existente, faça uma requisição **PUT** para o endpoint `/admin/papers/{symbol}`:

- **Endpoint**: `PUT /admin/papers/{symbol}`
- **Body (JSON)**:
```json
{
  "price": 19.0
}
```

### Exemplo de Uso:

```bash
curl -X POST "http://localhost:8000/admin/papers" -H "Content-Type: application/json" -d '{"symbol": "JROS", "price": 10.0}'
curl -X PUT "http://localhost:8000/admin/papers/JROS" -H "Content-Type: application/json" -d '{"price": 19.0}'
```

## Injetor de Ordens Aleatórias

O sistema está configurado para injetar ordens aleatórias automaticamente a cada 5 segundos. Assim, ao rodar o sistema, o **OrderInjectorService** começará a gerar ordens de compra e venda aleatórias para os papéis cadastrados.

## Obter Dados de Market Data em Tempo Real

Você pode obter os dados de mercado em tempo real fazendo uma requisição **GET** para o endpoint `/market-data`:

- **Endpoint**: `GET /market-data`

### Exemplo de Uso:

```bash
curl -X GET "http://localhost:8000/market-data"
```

Isso retornará os papéis disponíveis com seus valores de mercado atualizados, permitindo visualização em tempo real no frontend.

## Frontend (Gráfico e Livro de Ordens)

O frontend exibirá:
- **Gráfico de Trading** com os preços dos papéis atualizados.
- **Livro de Ordens** mostrando as ordens de compra e venda geradas automaticamente.

Acesse o frontend em `http://localhost:3000`.
