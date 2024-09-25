
# Sistema de Trading de Ativos

Este projeto é um sistema de trading de ativos que inclui frontend, backend, banco de dados e serviços de streaming usando Kafka ou RabbitMQ. Ele foi desenvolvido usando FastAPI para o backend e React para o frontend.

## Pré-requisitos

Para rodar o sistema localmente, você precisará ter os seguintes softwares instalados:

- Docker
- Docker Compose

## Como Subir o Sistema

1. **Clone o repositório**

   Se você ainda não clonou o projeto, faça isso usando o Git:
   
   ```bash
  git clone https://github.com/thespamer/trading-system.git
   cd trading-system
   ```

2. **Construa e inicie os contêineres com Docker Compose**

   Para levantar o sistema, execute o seguinte comando na raiz do projeto:

   ```bash
   docker-compose up --build
   ```

   Esse comando irá:
   - Construir o backend (FastAPI)
   - Construir o frontend (React)
   - Subir o banco de dados (PostgreSQL)
   - Subir o Kafka e o Zookeeper

3. **Acesse o frontend**

   Após subir os contêineres, você pode acessar a aplicação frontend no seguinte endereço:

   ```
   http://localhost:3000
   ```

4. **Acesse o backend (API)**

   O backend estará disponível em:

   ```
   http://localhost:8000
   ```

   A documentação da API (Swagger UI) pode ser acessada em:

   ```
   http://localhost:8000/docs
   ```

## Testando o Sistema

### 1. **Criar e visualizar ordens**

- Navegue até a página de **Ordens** no frontend.
- Insira os dados da ordem (símbolo, quantidade, tipo) e clique em "Enviar Ordem".
- As ordens criadas serão listadas na página de **Dashboard** no **Livro de Ordens**.

### 2. **Visualizar dados de mercado**

- Acesse a página de **Dados de Mercado** no frontend.
- As cotações de mercado em tempo real (simuladas) serão exibidas.

### 3. **Executar Estratégias de Trading**

- Acesse as rotas de estratégias via Swagger UI em `http://localhost:8000/docs`.
- Você pode listar as estratégias disponíveis e executar alguma delas.

## Executando Testes

Se quiser rodar os testes do backend (usando Pytest):

1. Abra um terminal e execute o seguinte comando para entrar no contêiner do backend:

   ```bash
   docker exec -it trading-system_backend_1 /bin/bash
   ```

2. Navegue até o diretório do app:

   ```bash
   cd app
   ```

3. Execute os testes:

   ```bash
   pytest
   ```

## Encerrando o Sistema

Para parar e remover todos os contêineres, execute o seguinte comando na raiz do projeto:

```bash
docker-compose down
```

Isso irá encerrar todos os serviços.
