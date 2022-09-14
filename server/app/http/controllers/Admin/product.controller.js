const createHttpError = require("http-errors");
const DefaultController = require("../default.controller");
const {ProductModel} = require("../../../models/Product");
const {StatusCodes} = require("http-status-codes");
const {isValidObjectId} = require("mongoose");
const {
    createProductValidator,
} = require("../../validators/Admin/product.validators");
const {
    uploadMultipleFiles,
    deleteImageFromPath,
} = require("../../../utils/imageUtils");
const {copyObject} = require("../../../utils/functions");
module.exports = new (class AdminProductController extends DefaultController {
    async createProduct(req, res, next) {
        try {
            const images = uploadMultipleFiles(
                req?.files || [],
                req.body.fileUploadPath
            );
            if(req.body.physicalFeatures){
                req.body.physicalFeatures = Array(req.body.physicalFeatures).map(item => {
                    return JSON.parse(item)
                })
            }
            if(req.body.additionalFeatures){

                req.body.additionalFeatures = Array(req.body.additionalFeatures).map(item => {
                    return JSON.parse(item)
                })
            }
            if(req.body.colors ){
                req.body.colors = Array(req.body.colors)
            }
            const bodyData = await createProductValidator.validateAsync(req.body);

            const {
                title,
                overView,
                description,
                category,
                tags,
                stockCount,
                discount,
                price,
                physicalFeatures,
                additionalFeatures,
                colors
            } = bodyData;
            const supplier = req.user._id;
            await ProductModel.create({
                title,
                overView,
                description,
                category,
                tags,
                discount,
                stockCount,
                price,
                physicalFeatures,
                additionalFeatures,
                supplier,
                images,
                colors
            })
                .then((result) => {
                    if (result) {
                        return res.status(StatusCodes.OK).json({
                            success: true,
                            message: "Products has been created successfully.",
                        });
                    }
                    throw {
                        status: StatusCodes.BadRequest,
                        message: "cannot create product",
                    };
                })
                .catch((err) => {
                    throw {status: StatusCodes.BadRequest, message: err};
                });
        } catch (error) {
            next(error);
        }
    }

    async editProduct(req, res, next) {
        try {
            const {id} = req.params;
            const product = await this.getById(id);
            const bodyData = copyObject(req.body);
            bodyData.images = uploadMultipleFiles(
                req?.files || [],
                req.body.fileUploadPath
            );
            Object.keys(bodyData).forEach((key) => {
                if (["likes", "dislikes", "comments", "rate"].includes(key))
                    delete bodyData[key];
                if (typeof bodyData[key] == "string")
                    bodyData[key] = bodyData[key].trim();
                if (Array.isArray(bodyData[key]) && bodyData[key].length > 0)
                    bodyData[key] = bodyData[key].map((item) => item.trim());
                if (Array.isArray(bodyData[key]) && bodyData[key].length === 0)
                    delete bodyData[key];
                if (
                    ["null", null, undefined, "undefined", " ", ""].includes(
                        bodyData[key]
                    )
                )
                    delete bodyData[key];
            });

            await ProductModel.updateOne({_id: id}, {$set: bodyData}).then(
                (result) => {
                    if (result.modifiedCount > 0) {
                        for (const image of product.images) {
                            deleteImageFromPath(image);
                        }
                        return res.status(StatusCodes.OK).json({
                            success: true,
                            message: "product has been updated successfully",
                        });
                    }
                    throw {
                        status: StatusCodes.BadRequest,
                        message: "product has not been updated successfully",
                    };
                }
            );
        } catch (error) {
            next(error);
        }
    }

    async removeProduct(req, res, next) {
        try {
            const {id} = req.params;
            const product = await this.getById(id);
            await ProductModel.deleteOne({_id: product._id})
                .then((result) => {
                    if (result && result.deletedCount > 0) {
                        for (const image of product.images) {
                            deleteImageFromPath(image);
                        }
                        return res.status(StatusCodes.OK).json({
                            success: true,
                            message: "product deleted successfully",
                        });
                    }
                    throw {
                        status: StatusCodes.BadRequest,
                        message: "product has not been deleted.",
                    };
                })
                .catch((err) => {
                    throw {status: StatusCodes.InternalServerError, message: err};
                });
        } catch (error) {
            next(error);
        }
    }

    async getAllProduct(req, res, next) {
        try {
            const search = req?.query?.search || "";
            let products;
            if (search) {
                products = await ProductModel.find({
                    $text: {
                        $search: search,
                    },
                });
            } else {
                products = await ProductModel.find({});
            }

            return res.status(StatusCodes.OK).json({
                success: true,
                products,
            });
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
            const {id} = req.params;
            const product = await this.getById(id);
            return res.status(StatusCodes.OK).json({
                success: true,
                product,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(id) {
        if (!isValidObjectId(id)) {
            throw {status: StatusCodes.BadRequest, message: "not a valid id"};
        }
        return await ProductModel.findOne({_id: id}).then((result) => {
            if (result) {
                return result;
            }
            throw {
                status: StatusCodes.NotFound,
                message: "there is no product with this id",
            };
        });
    }
})();
