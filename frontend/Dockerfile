
# Frontend Dockerfile
FROM node:16

WORKDIR /app

COPY package.json .

# Atualizar npm para a versão mais recente
RUN npm install -g npm@latest

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
