FROM node:18.3.0


WORKDIR /app
COPY package*.json /app/
RUN npm config set unsafe-perm true
RUN npm install --force
COPY . /app/
EXPOSE 5000
CMD ["npm" , "run" , "start"]

