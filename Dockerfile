# Imagem base oficial do Node.js
FROM node:20-bullseye

# Instala dependências do Playwright (inclui navegadores)
RUN apt-get update && \
    apt-get install -y wget gnupg && \
    rm -rf /var/lib/apt/lists/*

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do projeto e do Playwright
RUN npm install && \
    npx playwright install --with-deps

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta padrão do Express
EXPOSE 3000

# Comando para iniciar a API
CMD ["npm", "start"]