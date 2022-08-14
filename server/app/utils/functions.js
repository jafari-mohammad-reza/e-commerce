const {UserModel} = require("../models/User");
const {Kind} = require("graphql/language");

function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
    let nullishData = ["", " ", "0", 0, null, undefined];
    Object.keys(data).forEach((key) => {
        if (blackListFields.includes(key)) delete data[key];
        if (typeof data[key] == "string") data[key] = data[key].trim();
        if (Array.isArray(data[key]) && data[key].length > 0)
            data[key] = data[key].map((item) => item.trim());
        if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
        if (nullishData.includes(data[key])) delete data[key];
    });
}

function copyObject(object) {
    return JSON.parse(JSON.stringify(object));
}

function convertTOObject(value) {
    if (typeof value == "object") {
        return value;
    }
    if (typeof value == "string" && value.charAt(0) === "{") {
        return JSON.parse(value);
    }
    return null;
}

function parseLiteral(valueNode) {
    switch (valueNode.kind) {
        case Kind.STRING:
            return valueNode.value.charAt(0) === "{"
                ? JSON.parse(valueNode.value)
                : valueNode.value;
        case Kind.INT:
        case Kind.FLOAT:
            return Number(valueNode.value);
        case Kind.OBJECT:
    }
}

async function getUserCart(userID) {
    const userDetail = await UserModel.aggregate([
        {
            $match: {_id: userID},
        },
        {
            $project: {cart: 1},
        },
        {
            $lookup: {
                from: "products",
                localField: "cart.products.productId",
                foreignField: "_id",
                as: "productDetail",
            },
        },

        {
            $addFields: {
                productDetail: {
                    $function: {
                        body: function (productDetail, products) {
                            return productDetail.map(function (product) {
                                const count = products.find(
                                    (item) => item.productId.valueOf() == product._id.valueOf()
                                ).count;
                                const totalPrice = count * product.price;
                                return {
                                    ...product,
                                    cartCount: count,
                                    totalPrice,
                                    finalPrice:
                                        totalPrice - (product.discount / 100) * totalPrice,
                                };
                            });
                        },
                        args: ["$productDetail", "$cart.products"],
                        lang: "js",
                    },
                },
            },
        },
        {
            $project: {
                cart: 0,
            },
        },
    ]);
    return copyObject(userDetail);
}

module.exports = {
    deleteInvalidPropertyInObject,
    copyObject,
    convertTOObject,
    parseLiteral,
    getUserCart,
};
