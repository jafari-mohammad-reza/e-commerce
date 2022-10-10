/* eslint-disable no-unused-vars */
const express = require('express');
const path = require('path');
const createError = require('http-errors');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
require('express-rate-limit');
const cron = require('node-cron');
const {mainRouter} = require('./routes/router');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const configureMongoose = require('./conf/mongooseConfiguration');
const {userBirthDayDiscount, dailyDiscount} = require('./utils/schedule-tasks');
module.exports = class ApplicationServer {
  #app = express();

  /**
     *  Server constructor that stars everything
     *  @param {number}  port number
     *  @param {mongoUrl}  mongoUrl address
     */
  constructor(port, mongoUrl) {
    this.configureApplication();
    this.configureServer(port);
    this.configureDataBases(mongoUrl);
    this.configureRoutes();
    this.configureErrorHandlers();
    this.configureScheduleTasks();
  }

  /**
     *  Configure application middlewares
     * */
  configureApplication() {
    this.#app.use(morgan('dev'));
    this.#app.use(
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

        }),
    );


    this.#app.use(cors({credentials: true, origin: process.env.CLIENT_ADDRESS}));
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({extended: true}));
    this.#app.use(express.static(path.join(__dirname, '..', 'public')));
    this.#app.disable('x-powered-by');
    this.#app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(
            swaggerJsdoc({
              swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                  title: 'E-Commerce Api',
                  version: '1.0.0',
                  description: 'E-Commerce server api documentations',
                  contact: {
                    name: 'mohammadreza jafari',
                    url: 'https://mohammadrezajafari.info',
                    email: 'mohammadrezajafari.dev@gmail.com',
                  },
                },
                servers: [
                  {
                    url: process.env.SERVER_ADDRESS,
                  },
                ],
                components: {
                  securitySchemes: {
                    BearerAuth: {
                      type: 'http',
                      scheme: 'bearer',
                      bearerFormat: 'JWT',
                    },
                  },
                },
                security: [{BearerAuth: []}],
              },
              apis: ['./app/routes/**/*.js'],
            }),
        ),
    );
  }

  // ? \x1b[36m & \x1b[32m are console color codes to make it more attractive
  /**
     *  Configure application middlewares
     *    @param {number} port of application
     * */
  configureServer(port) {
    // if (cluster.isMaster) {
    //   for (let i = 0; i < os.cpus().length; i++) {
    //     cluster.fork();
    //   }
    //   cluster.on('exit', (_worker, _code, _signal) => {
    //     cluster.fork();
    //   });
    // } else {
    //   require('http')
    //       .createServer(this.#app)
    //       .listen(port, () => {
    //       });
    // }
    require('http')
        .createServer(this.#app)
        .listen(port, () => {
          console.log('Listen to server');
        });
  }

  /**
     * configure application scheduled tasks
     * */
  configureScheduleTasks() {
        cluster.isMaster ? cron.schedule('* * */24 * * *', async () => {
          console.log('\x1b[32m', 'running cron job');
          await dailyDiscount();
          await userBirthDayDiscount();
        }, {
          scheduled: true,
          timezone: 'Asia/Tehran',
        }) : null;
  }

  /**
     * configure application databases and connect to them
     * @param {mongoUrl} mongoUrl
     * */
  configureDataBases(mongoUrl) {
    configureMongoose(mongoUrl);
    require('./conf/redisConfiguration');
  }

  /**
     * configure application routes
     * */
  configureRoutes() {
    this.#app.use(mainRouter);
  }

  /**
     * configure application error handlers
     * */
  configureErrorHandlers() {
    this.#app.use((_req, _res, next) => {
      next(createError.NotFound('the route you looking for is not available.'));
    });
    this.#app.use((error, _req, res, _next) => {
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
  }
};
