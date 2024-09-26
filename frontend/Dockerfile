
# Frontend Dockerfile
FROM node:18

WORKDIR /app

COPY package.json ./

# Adicionar esta linha para resolver o problema do OpenSSL
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
