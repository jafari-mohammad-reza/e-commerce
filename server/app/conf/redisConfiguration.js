const createError = require("http-errors");
const redis = require("redis")
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    retry_strategy: function (options) {
        if (options.error && options.error.code === "ECONNREFUSED") {
            // End reconnecting on a specific error and flush all commands
            // with a individual error
            return new Error("The server refused the connection");
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
    },
    retry_max_delay: 1000 * 60 * 60,
    connect_timeout: 1000 * 60 * 60,
    max_attempts: 10,
}, "redisClient", {
    no_ready_check: true,
    enable_offline_queue: true,
    retry_unfulfilled_commands: true,
    retry_max_delay: 1000 * 60 * 60,
    connect_timeout: 1000 * 60 * 60,
    max_attempts: 10,
});

redisClient.connect().then((result) => {
    console.log("Connected to Redis")
}).catch((err) => {
    createError(err.message)
})
redisClient.on("error", (err) => {
    console.log(err)
    createError.InternalError(err.message)
})
redisClient.on("end", () => {
    console.log("Disconnected from Redis")
})
module.exports = redisClient;