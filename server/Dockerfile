FROM node:alpine
WORKDIR /app/
COPY package.json yarn.lock /app/
RUN cd /app \
    && yarn add install --pure-lockfile
COPY . /app/
EXPOSE 5000
CMD ["yarn" , "run" , "start"]

