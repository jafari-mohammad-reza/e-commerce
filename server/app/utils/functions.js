const {UserModel} = require('../models/User');
const {Kind} = require('graphql/language');
const redisClient = require('../conf/redisConfiguration');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment');
/**
 * delete all custom invalid properties in object
 * @param {{}} data
 * @param {*[]} blackListFields
 * */
function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  const nullishData = ['', ' ', '0', 0, null, undefined];
  Object.keys(data).forEach((key) => {
    if (blackListFields.includes(key)) delete data[key];
    if (typeof data[key] == 'string') data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key].length > 0) {
      data[key] = data[key].map((item) => item.trim());
    }
    if (Array.isArray(data[key]) && data[key].length === 0) delete data[key];
    if (nullishData.includes(data[key])) delete data[key];
  });
}
/**
 * this function will check for a key in redis cache and return a value or null
 * @param {string} key
 * @return {data}
 * */
async function checkRedisKey(key) {
  return new Promise(async (resolve, reject) => {
    redisClient.get(key).then((data) => {
      resolve(data ? JSON.parse(data) : null);
    }).catch((error) => {
      reject(createHttpError.InternalServerError(error.message));
    });
  });
}


/**
 * transform an input object to a valid json object
 * @param {object} object
 * @return {object}  valid json object
 * */
function copyObject(object) {
  return JSON.parse(JSON.stringify(object));
}

/**
 * transform string to an object (example : "{name : "mohammad"}" => {name : "mohammad})
 * @param {value} value
 * @return {value}  valid json object
 * */
function convertTOObject(value) {
  if (typeof value == 'object') {
    return value;
  }
  if (typeof value == 'string' && value.charAt(0) === '{') {
    return JSON.parse(value);
  }
  return null;
}

/**
 * parse value to its valid datatype
 * @param {valueNode} valueNode
 * @return {valueNode} valueNode valid datatype
 * */
function parseLiteral(valueNode) {
  switch (valueNode.kind) {
    case Kind.STRING:
      return valueNode.value.charAt(0) === '{' ?
          JSON.parse(valueNode.value) :
          valueNode.value;
    case Kind.INT:
    case Kind.FLOAT:
      return Number(valueNode.value);
    case Kind.OBJECT:
  }
}

/**
 * return user cart and apply some aggregations on it by user ID
 * @param {userID} userID
 * @return {cart} cart
 * */
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
        from: 'products',
        localField: 'cart.products.productId',
        foreignField: '_id',
        as: 'productsDetail',
      },
    },


    {
      $addFields: {
        'productsDetail': {
          $function: {
            body: function(productsDetail, products) {
              return productsDetail.map(function(product) {
                const count = products.find((item) => item.productId.valueOf() === product._id.valueOf()).count;
                const totalPrice = count * product.price;
                const imagesURL = product.images.map((image) => `${process.env.SERVER_ADDRESS}/${image}`);
                return {
                  ...product,
                  imagesURL,
                  basketCount: count,
                  totalPrice,
                  finalPrice: totalPrice - ((product.discount / 100) * totalPrice),
                };
              });
            },
            args: ['$productsDetail', '$cart.products'],
            lang: 'js',
          },
        },
        'paymentDetail': {
          $function: {
            body: function(productsDetail, products) {
              const productDiscountedAmount = productsDetail.reduce(function(total, product) {
                const count = products.find((item) => item.productId.valueOf() === product._id.valueOf()).count;
                const totalPrice = count * product.price;
                return total + (totalPrice - ((product.discount / 100) * totalPrice));
              }, 0);
              const productActualAmount = productsDetail.reduce(function(total, product) {
                const count = products.find((item) => item.productId.valueOf() === product._id.valueOf()).count;
                return count * product.price;
              }, 0);
              return {
                DiscountedPaymentAmount: productDiscountedAmount,
                ActualPaymentAmount: productActualAmount,
              };
            },
            args: ['$productsDetail', '$cart.products'],
            lang: 'js',
          },
        },
      },
    },
    {
      $project: {
        'productsDetail.title': 1,
        'productsDetail._id': 1,
        'productsDetail.price': 1,
        'productsDetail.discount': 1,
        'productsDetail.category': 1,
        'productsDetail.basketCount': 1,
        'productsDetail.finalPrice': 1,
        'productsDetail.totalPrice': 1,
        'productsDetail.imagesURL': 1,
        'paymentDetail': 1,
      },
    },

    {
      $project: {
        cart: 0,
      },
    },
  ]);
  return copyObject(userDetail[0]);
}

/**
 * return value converted to ObjectId
 * @param {string} id
 * @return {string}
 * */
function valueToObjectId(id) {
  return ObjectId(id);
}

/**
 * this function will convert list of objects in a string to real array
 * @param {string} data
 * @return {data}
 * */
function objectsStringToArray(data) {
  return copyObject(data.replace(/'/g, '"').replace(/[\])[(]/g, '')).split(',');
}
/**
 * generate an invoice number
 * @return {number}
 * */
function invoiceNumberGenerator() {
  return moment().format('jYYYYjMMjDDHHmmssSSS') + String(process.hrtime()[1]).padStart(9, 0);
}

module.exports = {
  deleteInvalidPropertyInObject,
  copyObject,
  convertTOObject,
  parseLiteral,
  getUserCart,
  checkRedisKey,
  valueToObjectId,
  objectsStringToArray,
  invoiceNumberGenerator,
};
