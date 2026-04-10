FROM node:20-alpine

WORKDIR /app

ENV PORT=3000

COPY package.json package-lock.json tsconfig.json ./
COPY src ./src

RUN npm ci 
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
