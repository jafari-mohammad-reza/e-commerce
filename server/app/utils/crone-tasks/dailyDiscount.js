const {default: mongoose} = require("mongoose");

async function DailyDiscount() {
    const randomSkipNumber = Math.floor(await mongoose.model("product").count().exec().then(count => {
        return count / 4
    }))

    mongoose.model("product").aggregate([
        {
            $match: {
                discount: {$exists: true},
                updatedAt: {$lt: new Date() - 1000 * 60 * 60 * 12},

            }
        },
        {
            $project: {
                _id: 1,
                discount: 1,
                price: 1
            }
        },
        {
            $skip: randomSkipNumber
        },
        {
            $limit: 30
        },


    ]).exec(async (err, products) => {
        if (err) {
            console.log(err)
            throw new Error(err)
        } else {
            for (const product of products) {
                product.discount = Math.floor(Math.random() * 75).toString()
                await mongoose.model("product").updateOne({_id: product._id}, product, (_err, _result) => {
                })
            }
            console.log("Daily discounts applied")
        }
    })

}

module.exports = {DailyDiscount}
