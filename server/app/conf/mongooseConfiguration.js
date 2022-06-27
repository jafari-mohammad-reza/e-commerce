const {default: mongoose} = require("mongoose");

function configureMongoose(mongoUrl) {
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

module.exports = configureMongoose;