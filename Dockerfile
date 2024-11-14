FROM node:18-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Run seed commands
RUN npx tsx lib/seeders/flight.ts && \
    npx tsx lib/seeders/users.ts

EXPOSE 3000

CMD ["npm", "start"]
