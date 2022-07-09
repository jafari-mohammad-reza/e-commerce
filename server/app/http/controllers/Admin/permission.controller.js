const DefaultController = require("../default.controller");
const createHttpError = require("http-errors");
const {PermissionsModel} = require("../../../models/Permission");
const {StatusCodes} = require("http-status-codes");
const {isValidObjectId} = require("mongoose");
const {RoleModel} = require("../../../models/Role");
module.exports = new (class PermissionController extends DefaultController {
    async getAllPermissions(req, res, next) {
        try {
            await PermissionsModel.find({})
                .then((result) => {
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: result,
                    });
                })
                .catch((error) => {
                    throw createHttpError.InternalServerError(error);
                });
        } catch (error) {
            next(error);
        }
    }

    async createPermission(req, res, next) {
        try {
            const {title} = req.body;
            if (!title) {
                throw createHttpError.BadRequest(
                    "each permission need to have a title."
                );
            }
            if (await PermissionsModel.findOne({title})) {
                throw createHttpError.BadRequest(
                    "there is already one permission with this title."
                );
            }
            await PermissionsModel.create({title})
                .then((result) => {
                    if (!result) {
                        throw createHttpError.InternalServerError(
                            "permission has not been crated successfully."
                        );
                    }
                    return res.status(StatusCodes.CREATED).json({
                        success: true,
                        message: "permission has been created successfully.",
                    });
                })
                .catch((error) => {
                    throw createHttpError.InternalServerError(error);
                });
        } catch (error) {
            next(error);
        }
    }

    async updatePermission(req, res, next) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                throw createHttpError.BadRequest("Not a valid id.");
            }
            const {title} = req.body;
            if (!title) {
                throw createHttpError.BadRequest(
                    "each permission need to have a title."
                );
            }
            await PermissionsModel.findByIdAndUpdate(id, {$set: {title}})
                .then((result) => {
                    if (!result) {
                        throw createHttpError.InternalServerError(
                            "permission has not been updated successfully."
                        );
                    }
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: "permission has been updated successfully.",
                    });
                })
                .catch((error) => {
                    throw createHttpError.InternalServerError(error);
                });
        } catch (error) {
            next(error);
        }
    }

    async deletePermission(req, res, next) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                throw createHttpError.BadRequest("Not a valid id.");
            }
            await PermissionsModel.findByIdAndDelete(id)
                .then((result) => {
                    if (!result) {
                        throw createHttpError.InternalServerError(
                            "permission has not been deleted successfully."
                        );
                    }
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: "permission has been deleted successfully.",
                    });
                })
                .catch((error) => {
                    throw createHttpError.InternalServerError(error);
                });
        } catch (error) {
            next(error);
        }
    }
})();
