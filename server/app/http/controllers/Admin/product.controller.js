const createHttpError = require("http-errors");
const DefaultController = require("../default.controller")
module.exports = new (class AdminProductController extends DefaultController {
    constructor() {
        super();
    }
    createProduct(req, res, next) {
        try {

        } catch (error) {
            next(createHttpError.InternalServerError(error))
        }
    }
    editProduct(req, res, next) {
        try {

        } catch (error) {
            next(createHttpError.InternalServerError(error))
        }
    }
    removeProduct(req, res, next) {
        try {

        } catch (error) {
            next(createHttpError.InternalServerError(error))
        }
    }
    getAllProduct(req, res, next) {
        try {

        } catch (error) {
            next(createHttpError.InternalServerError(error))
        }
    }
    getProductById(req, res, next) {
        try {

        } catch (error) {
            next(createHttpError.InternalServerError(error))
        }
    }
})()