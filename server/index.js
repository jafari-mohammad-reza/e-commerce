require('dotenv').config();
const server = require('./app/server');
new server(5000, process.env.MONGO_URL);
