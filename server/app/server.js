const express = require("express");
const { default: mongoose, mongo } = require("mongoose");
const path = require("path");
const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const { mainRouter } = require("./routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
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
            info: {
              title: "E-Commerce server",
              description: "E-Commerce server api endpoints",
              version: "1.0.0",
              contact: {
                email: "mohammadrezajafari.dev@gmail.com",
                name: "Mohammadreza Jafari",
                url: "https://www.mohammadrezajafari.info",
              },
            },
            host: "http://localhost:5000",
          },

          apis: ["./routes/**/*.js"],
        })
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
    mongoose.connect(mongoUrl);
    const connection = mongoose.connection;
    connection.on("open", () => {
      console.log("\x1b[34m", "Connected to mongodb");
    });
    connection.on("close", () => {
      console.log("\x1b[33m", "Disconnected from mongodb");
    });
    connection.once("error", (error) => {
      console.log(
        "\x1b[35m",
        `Error while connecting to mongodb , error : ${error.message}`
      );
    });
    process.once("SIGINT", async () => {
      await connection.close();
      process.exit(0);
    });
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
    this.#app.use((err, req, res, next) => {
      const statusCode =
        err?.status || err?.code || StatusCodes.INTERNAL_SERVER_ERROR;
      const message = err?.message || createError.InternalServerError().message;
      return res.status(statusCode).json({
        errors: { statusCode, success: false, message },
      });
    });
  }
};
