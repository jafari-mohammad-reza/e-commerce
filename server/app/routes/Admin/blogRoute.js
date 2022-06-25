const router = require("express").Router();
const BlogAdminController  = require("../../http/controllers/Admin/blog.controller")
const {imageUploader} = require("../../utils/imageUtils");
const {stringToArray} = require("../../http/middleWares/StringToArray");
router.get("/" , BlogAdminController.getAllBlogs)
router.get("/:id" , BlogAdminController.getBlogById)
router.get("/?search" , BlogAdminController.getBlogByQuery)
router.post("/" , imageUploader.single("image") , stringToArray("tags") , BlogAdminController.createBlog)
router.put("/" , BlogAdminController.editBlog)
router.delete("/" , BlogAdminController.deleteBlog)
module.exports = {
    AdminBlogRoutes : router
}