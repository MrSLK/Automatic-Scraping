FROM node:16-alpine
WORKDIR /
COPY package.json package-lock.json ./
RUN npm i --frozen-lockfile
COPY . .
EXPOSE 4000
CMD npm start