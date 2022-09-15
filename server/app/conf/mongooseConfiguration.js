const {default: mongoose} = require('mongoose');
const createHttpError = require('http-errors');
/**
 * connect to mongodb
 * @param {string} mongoUrl
 * */
function configureMongoose(mongoUrl) {
  mongoose.connect(mongoUrl).then((result) => {
    const connection = result.connection;
    console.log('connected to mongo');
    connection.on('close', () => {
      console.log('\x1b[33m', 'Disconnected from mongodb');
    });
    process.once('SIGINT', async () => {
      await connection.close();
      process.exit(0);
    });
  }).catch((error) => {
    console.log(error);
    throw createHttpError.InternalServerError(`Mongoose failed to connect ${error.message}`);
  });
}

module.exports = configureMongoose;
