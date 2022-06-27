const DefaultController = require("../default.controller")
const createHttpError = require("http-errors")
const { createBlogValidator } = require("../../validators/Admin/blog.validators");
const path = require("path")
const { StatusCodes } = require("http-status-codes");
const { BlogModel } = require("../../../models/Blog");
const { isValidObjectId } = require("mongoose");
const { createTransport } = require("nodemailer");
const { deleteImageFromPath } = require("../../../utils/imageUtils");
module.exports = new class AdminBlogController extends DefaultController {
    async createBlog(req, res, next) {
        try {
            const bodyData = await createBlogValidator.validateAsync(req.body);
            const { title, overView, content, tags, category } = bodyData;
            req.body.image = (path.join(req.body.fileUploadPath, req.body.fileName)).replaceAll(/\\/gi)
            const image = req.body.image
            const author = req?.user?._id
            await BlogModel.create({ title, overView, content, tags, category, image, author }).then(() => {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    message: "Blog has been created successfuly."
                })
            }).catch(error => {
                throw createHttpError.INTERNALSERVERERROR(error)
            })
        } catch (error) {
            next(createHttpError.InternalServerError(error))
        }
    }

    async editBlog(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Not a valid id"
                })
            }

            if (req?.body?.fileUploadPath && req?.body?.filename) {
                req.body.image = path.join(req.body.fileUploadPath, req.body.filename)
                req.body.image = req.body.image.replace(/\\/g, "/")
            }
            const data = req.body;
            let nullishData = ["", " ", "0", 0, null, undefined]
            let blackListFields = ["bookmarks", "deslikes", "comments", "likes", "author"]
            Object.keys(data).forEach(key => {
                if (blackListFields.includes(key)) delete data[key]
                if (typeof data[key] == "string") data[key] = data[key].trim();
                if (Array.isArray(data[key]) && data[key].length > 0) data[key] = data[key].map(item => item.trim())
                if (nullishData.includes(data[key])) delete data[key];
            })
            await BlogModel.updateOne({ _id: id }, { $set: data }).then(result => {
                if (result.modifiedCount > 0) {
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: "Blog has been updated successfully."
                    })
                }
                throw createHttpError.BadRequest("the blog could not be updated")
            }).catch(err => {
                throw createHttpError.InternalServerError(err)
            })
        } catch (error) {
            next(createHttpError.InternalServerError(error))
        }
    }

    async deleteBlog(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                throw createHttpError.BadRequest("the id is not valid")
            }
            await BlogModel.deleteOne({ _id: id }).then((result) => {
                if (result.deletedCount > 0) {
                    deleteImageFromPath(result.image)
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: "blog has been deleted successfully."
                    })
                }
                throw createHttpError.BadRequest("the blog could not be deleted")
            }).catch(err => {
                throw createHttpError.InternalServerError(err)
            })
        } catch (error) {
            next(createHttpError.InternalServerError(error))
        }
    }

    async getAllBlogs(req, res, next) {
        try {
            const blogs = await BlogModel.aggregate([
                { $match: {} },
                {
                    $lookup: {
                        from: "users",
                        foreignField: "_id",
                        localField: "author",
                        as: "author"
                    }
                },
                {
                    $unwind: "$author"
                },
                {
                    $lookup: {
                        from: "categories",
                        foreignField: "_id",
                        localField: "category",
                        as: "category"
                    }
                },
                {
                    $unwind: "$category"
                },
                {
                    $project: {
                        "author.__v": 0,
                        "category.__v": 0,
                        "author.otp": 0,
                        "author.Roles": 0,
                        "author.discount": 0,
                        "author.orders": 0,
                    }
                }
            ]).catch(err => { throw createHttpError.INTERNALSERVERERROR(err) })
            return res.status(StatusCodes.OK).json({
                success: true,
                blogs
            })
        } catch (error) {
            next(createHttpError.InternalServerError(error))
        }
    }

    async getBlogById(req, res, next) {
        try {
            const { id } = req.params;
            if (!isValidObjectId(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Not a valid id"
                })
            }
            await BlogModel.findOne({ _id: id }).populate([{ path: "category", select: ['title'] }, { path: "author", select: ['mobile', 'first_name', 'last_name', 'username'] }]).then(result => {
                if (!result) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: "BLog not found"
                    })
                }
                return res.status(StatusCodes.OK).json({
                    success: true,
                    blog: result
                })
            }).catch(error => {
                throw createHttpError.InternalServerError(error)
            })

        } catch (error) {
            next(createHttpError.InternalServerError(error))
        }
    }
    // should be tested in future
    async getBlogByQuery(req, res, next) {
        try {
            const { query } = req.params;
            await BlogModel.findOne({ query }).then(result => {
                if (!result) {
                    return res.status(StatusCodes.NotFound).json({
                        success: false,
                        message: "Blog not found"
                    })
                }
                return res.status(StatusCodes.OK).json({
                    success: true,
                    blog: result
                })
            }).catch(err => {
                throw createHttpError.BadRequest(err);
            })
        } catch (error) {
            next(createHttpError.InternalServerError(error))
        }
    }



}()