const express = require("express");
const { default: mongoose, mongo } = require("mongoose");
const path = require("path");
const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const {mainRouter} = require("./routes/router");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const configureMongoose = require("./conf/mongooseConfiguration");
module.exports = class ApplicationServer {
  #app = express();

  constructor(port, mongoUrl) {
    this.configureApplication();
    this.configureServer(port);
    this.configureDataBases(mongoUrl);
    this.configureRoutes();
    this.configureErrorHandlers();
  }
  configureApplication() {
    this.#app.use(morgan("dev"));
    this.#app.use(helmet());
    this.#app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "public")));
    this.#app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(
        swaggerJsdoc({
            swaggerDefinition: {
                openapi: "3.0.0",
                info: {
                    title: "E-Commerce Api",
                    version: "1.0.0",
                    description: "E-Commerce server api documntations",
                    contact: {
                        name: "mohammadreza jafari",
                        url: "https://mohammadrezajafari.info",
                        email: "mohammadrezajafari.dev@gmail.com",
                    },
                },
                servers: [
                    {
                        url: "http://localhost:5000",
                    },
                ],
                components: {
                    securitySchemes: {
                        BearerAuth: {
                            type: "http",
                            scheme: "bearer",
                            bearerFormat: "JWT",
                        },
                    },
                },
                security: [{BearerAuth: []}],
            },
            apis: ["/app/routes/**/*.js"],
        }),
          {explorer: true}
      )
    );
  }
  //? \x1b[36m & \x1b[32m are console color codes to make it more attractive
  configureServer(port) {
    require("http")
      .createServer(this.#app)
      .listen(port, () => {
        console.log("\x1b[36m", `Running > http://localhost:${port}`);
      });
  }
  configureDataBases(mongoUrl) {
      configureMongoose(mongoUrl);
      require("./conf/redisConfiguration");
  }
  configureRoutes() {
    this.#app.get("/", (req, res) => {
      return res.json("hello");
    });
    this.#app.use(mainRouter);
  }
  configureErrorHandlers() {
      this.#app.use((req, res, next) => {
          next(createError.NotFound("the route you looking for is not available."));
      });
      this.#app.use((error, req, res, next) => {
          const serverError = createError.InternalServerError();
          const statusCode = error.status || serverError.status;
          const message = error.message || serverError.message;
          return res.status(statusCode).json({
              errors: {
                  statusCode,
                  message,
              },
          });
      });
  }
};
