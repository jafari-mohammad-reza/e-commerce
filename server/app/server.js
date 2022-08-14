const express = require("express");
const {default: mongoose, mongo} = require("mongoose");
const path = require("path");
const createError = require("http-errors");
const {StatusCodes} = require("http-status-codes");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cluster = require("cluster")
const os = require("os")
const limit = require("express-rate-limit")
const cron = require("node-cron")
const {mainRouter} = require("./routes/router");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const configureMongoose = require("./conf/mongooseConfiguration");
const {ProductModel} = require("./models/Product");
module.exports = class ApplicationServer {
    #app = express();

    constructor(port, mongoUrl) {
        this.configureApplication();
        this.configureServer(port);
        this.configureDataBases(mongoUrl);
        this.configureRoutes();
        this.configureErrorHandlers();
        this.configureDailyDiscounts()
    }

    configureApplication() {
        this.#app.use(morgan("dev"));
        this.#app.use(
            helmet({
                crossOriginResourcePolicy: false,
                contentSecurityPolicy: (process.env.Node_ENV === "production"),
            })
        );
        this.#app.use(cors({credentials: true, origin: "http://localhost:3000"}));
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({extended: true}));
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
                    apis: ["./app/routes/**/*.js"],
                })
            )
        );
    }

    //? \x1b[36m & \x1b[32m are console color codes to make it more attractive
    configureServer(port) {
        if (cluster.isMaster) {
            for (let i = 0; i < os.cpus().length; i++) {
                cluster.fork()
            }
            cluster.on("exit", (worker, code, signal) => {
                cluster.fork()

            })
        } else {
            require("http")
                .createServer(this.#app)
                .listen(port, () => {
                });
        }

    }

    configureDailyDiscounts() {
        cluster.isMaster ? cron.schedule("* * */24 * * *", () => {
            console.log("\x1b[32m", "running cron job")
            mongoose.model("product").aggregate([
                {
                    $match: {
                        updatedAt: {
                            $gte: new Date(Date.now() - 1000 * 60 * 60 * 12),
                        }
                    },

                    $project: {
                        _id: 1,
                        discount: 1,
                        price: 1,
                        title: 1,
                    },

                }
            ]).limit(30).exec((err, products) => {
                if (err) {
                    console.log(err)
                    throw new Error(err)
                } else {
                    products.forEach(product => {
                        product.discount = Math.floor(Math.random() * 75).toString()
                        mongoose.model("product").updateOne({_id: product._id}, product, (err, result) => {
                        })

                    })
                    console.log("Daily discounts applied")
                }
            })

        }, {
            scheduled: true,
            timezone: "Asia/Tehran",
        }) : null;
    }


    configureDataBases(mongoUrl) {
        configureMongoose(mongoUrl);
        require("./conf/redisConfiguration");
    }

    configureRoutes() {
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
                statusCode,
                errors: {
                    message,
                },
            });
        });
    }
};
