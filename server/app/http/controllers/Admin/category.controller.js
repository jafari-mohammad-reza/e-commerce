const DefaultController = require("../default.contoller")
const createError = require("http-errors")
const {modifyCategory} = require("../../validators/Admin/category.validators");
const {CategoryModel} = require("../../../models/Category");
const {StatusCodes} = require("http-status-codes");
const {isValidObjectId} = require("mongoose");
module.exports = new (class CategoryController extends DefaultController {
    async createCategory(req, res, next) {
        try {
            const bodyData = await modifyCategory.validateAsync(req.body)
            const {title, parent} = bodyData;
            if (await CategoryModel.findOne({title}, {__v: 0, parent: 0})) {
                throw createError.InternalServerError("there is already one category with this title.")
            }
            await CategoryModel.create(bodyData).then(result => {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    message: "Category created successfully."
                })
            }).catch(error => {
                throw createError.InternalServerError(error)
            })
        } catch (error) {
            next(createError(error))
        }
    }

    async editCategory(req, res, next) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                throw createError.BadRequest("the id is not valid")
            }
            const bodyData = await modifyCategory.validateAsync(req.body);
            const {title, parent} = bodyData;
            await CategoryModel.updateOne({_id: id}, {$set: {title, parent}}).then(result => {
                if (result.modifiedCount > 0) {
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: "Category has been updated successfully."
                    }).catch(err => {
                        throw createError.InternalServerError(err)
                    })
                }
            })
        } catch (error) {
            next(createError(error))
        }
    }

    async removeCategory(req, res, next) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                throw createError.BadRequest("the id is not valid")
            }
            await CategoryModel.findOne({_id: id}).then(result => {
                if (!result) {
                    throw createError.NotFound("there was no category with this id.")
                }
                CategoryModel.deleteMany({$or: [{_id: id}, {parent: id}]})
                return res.status(StatusCodes.OK).json({
                    success: true,
                    message: "the category and all it childs hav been removed"
                })
            }).catch(error => {
                throw createError.InternalServerError(error)
            })
        } catch (error) {
            next(createError(error))
        }
    }

    async getAllCategories(req, res, next) {
        try {
            const categories = await CategoryModel.aggregate([])
            return res.status(StatusCodes.OK).json({
                success: true,
                data: categories
            })
        } catch (error) {
            next(createError(error))
        }
    }

    async getAllParentCategories(req, res, next) {
        try {
            const parentCategories = await CategoryModel.find({parent: undefined});
            return res.status(StatusCodes.OK).json({
                success: true,
                data: parentCategories
            })
        } catch (error) {
            next(createError(error))
        }
    }

    async getCategoryById(req, res, next) {
        try {
            const {id} = req.params
            if (!isValidObjectId(id)) {
                throw createError.BadRequest("the id is not valid")
            }
            const category = await CategoryModel.findOne({id}, {__v: 0, parent: 0})
            return res.status(StatusCodes.OK).json({
                success: true,
                data: category
            })

        } catch (error) {
            next(createError(error))
        }
    }

    async getParentCategoryById(req, res, next) {
        try {
            const {id} = req.params
            if (!isValidObjectId(id)) {
                throw createError.BadRequest("the id is not valid")
            }
            const categories = await CategoryModel.aggregate([
                {
                    $match: {
                        _id: id
                    }
                },
                {
                    $lookup: {
                        from: "category",
                        localField: "_id",
                        foreignField: "paernt",
                        as: "children"
                    }
                },

                {
                    $project: {
                        __v: 0,
                        "parent.__v": 0,
                    }
                }])
            return res.status(StatusCodes.OK).json({
                success: true,
                data: categories
            })
        } catch (error) {
            next(createError(error))
        }
    }



})
()