FROM node:lts

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN  npm cache clean --force

RUN npm install postgresql @nestjs/cli prisma jest
RUN npm i --save class-validator class-transformer

COPY package.json .

COPY package-lock.json .

RUN npm install

# Value set in .env file.
EXPOSE $BACKEND_PORT

CMD ["npm", "run", "start:dev"]