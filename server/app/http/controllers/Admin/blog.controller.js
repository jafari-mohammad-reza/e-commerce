const DefaultController = require("../default.controller");
const createHttpError = require("http-errors");
const {
    createBlogValidator,
} = require("../../validators/Admin/blog.validators");
const path = require("path");
const {StatusCodes} = require("http-status-codes");
const {BlogModel} = require("../../../models/Blog");
const {isValidObjectId} = require("mongoose");
const {createTransport} = require("nodemailer");
const {deleteImageFromPath} = require("../../../utils/imageUtils");
const {copyObject} = require("../../../utils/functions");
module.exports = new (class AdminBlogController extends DefaultController {
    async createBlog(req, res, next) {
        try {
            const bodyData = await createBlogValidator.validateAsync(req.body);
            const {title, overView, content, tags, category} = bodyData;
            const image = path
                .join(req.body.fileUploadPath, req.body.fileName)
                .replaceAll(/\\/gi);

            const author = req?.user?._id;
            if (await BlogModel.findOne({title})) {
                throw createHttpError.BadRequest("Blog with this title already exists");
            }
            await BlogModel.create({
                title,
                overView,
                content,
                tags,
                category,
                image,
                author,
            })
                .then(() => {
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        message: "Blog has been created successfuly.",
                    });
                })
                .catch((error) => {
                    throw createHttpError.InternalServerError(error);
                });
        } catch (error) {
            next(error);
        }
    }

    async editBlog(req, res, next) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Not a valid id",
                });
            }
            const blog = await BlogModel.findOne({_id: id}).catch((err) => {
                throw createHttpError.InternalServerError(err);
            });
            if (!blog) {
                throw createHttpError.BadRequest("the blogs could not be found");
            }
            if (req.body.fileUploadPath && req.body.fileName) {
                req.body.image = path.join(req.body.fileUploadPath, req.body.fileName);
                req.body.image = req.body.image.replace(/\\/g, "/");
            }
            const image = req.body.image || blog.image;
            const bodyData = copyObject(req.body);
            let nullishData = ["", " ", "0", 0, null, undefined];
            let blackListFields = [
                "bookmarks",
                "dislikes",
                "comments",
                "likes",
                "author",
            ];
            Object.keys(bodyData).forEach((key) => {
                if (blackListFields.includes(key)) delete bodyData[key];
                if (typeof bodyData[key] == "string")
                    bodyData[key] = bodyData[key].trim();
                if (Array.isArray(bodyData[key]) && bodyData[key].length > 0)
                    bodyData[key] = bodyData[key].map((item) => item.trim());
                if (nullishData.includes(bodyData[key])) delete bodyData[key];
            });
            await BlogModel.updateOne({_id: id}, {$set: bodyData, image})
                .then((result) => {
                    if (result.modifiedCount > 0) {
                        deleteImageFromPath(blog?.image);
                        return res.status(StatusCodes.OK).json({
                            success: true,
                            message: "Blog has been updated successfully.",
                        });
                    }
                    throw createHttpError.BadRequest("the blogs could not be updated");
                })
                .catch((err) => {
                    throw createHttpError.InternalServerError(err);
                });
        } catch (error) {
            next(error);
        }
    }

    async deleteBlog(req, res, next) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                throw createHttpError.BadRequest("the id is not valid");
            }
            const blog = await BlogModel.findOne({_id: id}).catch((err) => {
                throw createHttpError.InternalServerError(err);
            });
            if (!blog) {
                throw createHttpError.BadRequest("the blogs could not be found");
            }
            await BlogModel.deleteOne({_id: id})
                .then((result) => {
                    if (result.deletedCount > 0) {
                        deleteImageFromPath(blog.image);
                        return res.status(StatusCodes.OK).json({
                            success: true,
                            message: "blogs has been deleted successfully.",
                        });
                    }
                    throw createHttpError.BadRequest("the blogs could not be deleted");
                })
                .catch((err) => {
                    throw createHttpError.InternalServerError(err);
                });
        } catch (error) {
            next(error);
        }
    }

    async getAllBlogs(req, res, next) {
        try {
            const blogs = await BlogModel.find(
                {},
                {
                    like: 0,
                    dislikes: 0,
                    bookmarks: 0,
                }
            ).catch((err) => {
                throw createHttpError.InternalServerError(err);
            });
            return res.status(StatusCodes.OK).json({
                success: true,
                blogs,
            });
        } catch (error) {
            next(error);
        }
    }

    async getBlogById(req, res, next) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Not a valid id",
                });
            }
            await BlogModel.findOne({_id: id})
                .populate([
                    {path: "category", select: ["title"]},
                    {
                        path: "author",
                        select: ["mobile", "first_name", "last_name", "username"],
                    },
                ])
                .then((result) => {
                    if (!result) {
                        return res.status(StatusCodes.NOT_FOUND).json({
                            success: false,
                            message: "BLog not found",
                        });
                    }
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        blog: result,
                    });
                })
                .catch((error) => {
                    throw createHttpError.InternalServerError(error);
                });
        } catch (error) {
            next(error);
        }
    }

    // should be tested in future
    async getBlogByQuery(req, res, next) {
        try {
            const {query} = req.params;
            await BlogModel.findOne({query})
                .then((result) => {
                    if (!result) {
                        return res.status(StatusCodes.NotFound).json({
                            success: false,
                            message: "Blog not found",
                        });
                    }
                    return res.status(StatusCodes.OK).json({
                        success: true,
                        blog: result,
                    });
                })
                .catch((err) => {
                    throw createHttpError.BadRequest(err);
                });
        } catch (error) {
            next(error);
        }
    }
})();
