const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const {mainRouter} = require('./app/routes/router');
const createError = require('http-errors');
const configureMongoose = require('./app/conf/mongooseConfiguration');
const app = express();
require('dotenv').config();

app.use(morgan('dev'));
app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: (process.env.Node_ENV === 'production'),
      dnsPrefetchControl: true,
      frameguard: {action: 'deny'},
      expectCt: {
        enforce: true,
        maxAge: 94600,
      },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31104000,
        includeSubDomains: false,
      },
      ieNoOpen: true,
      noSniff: true,
      referrerPolicy: {policy: ['origin', 'unsafe-url']},
      xssFilter: true,
      originAgentCluster: true,

    }));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');
app.use(mainRouter);
app.use((_req, _res, next) => {
  next(createError.NotFound('the route you looking for is not available.'));
});
app.use((error, _req, res, _next) => {
  const serverError = createError.InternalServerError();
  const statusCode = error.status || serverError.status;
  const message = error.message || serverError.message;
  return res.status(statusCode).json({
    statusCode,
    errors: {
      message,
    },
  });
});
configureMongoose('mongodb://localhost:27017/e-commerce');
app.listen(4000, () => {
  console.log(`Test app is running \n Swagger docs: http://localhost:4000/api-docs \n Graphql playground: http://localhost:4000/graphql \n graphql docs: http://localhost:4000/graphql-doc`);
});
module.exports = app;
