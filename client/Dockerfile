FROM node:alpine

WORKDIR /app/
COPY package*.json /app/
RUN npm install --force
COPY . /app/
EXPOSE 3000
CMD ["npm" , "run" , "dev"]
