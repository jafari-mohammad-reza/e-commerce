FROM node:18.3.0


WORKDIR /app/
COPY package*.json .
RUN npm install --force
COPY . .
EXPOSE 3000
CMD ["npm" , "start"]
