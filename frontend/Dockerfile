
# Frontend Dockerfile
FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

# Copiar todos os arquivos, incluindo a pasta src
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
