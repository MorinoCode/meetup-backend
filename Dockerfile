
FROM node:20-alpine
WORKDIR /meetup-backend
COPY package.json package-lock.json* ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm","start"]
