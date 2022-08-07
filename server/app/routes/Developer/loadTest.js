const router = require("express").Router()

router.get("/", (req, res) => {
    let sum = 0;
    for (let index = 0; index < 1e10; index++) {
        sum += index
    }

    res.json({number: sum.toString()});
})

module.exports = {
    DeveloperRouter: router
}