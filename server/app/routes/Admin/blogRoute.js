const router = require("express").Router();
const AdminBlogController = require("../../http/controllers/Admin/blog.controller")
const { imageUploader } = require("../../utils/imageUtils");
const { stringToArray } = require("../../http/middleWares/StringToArray");
/**
 * @swagger
 *  /admin/blog:
 *      get:
 *          tags : [Admin-Blog]
 *          description: Get all blogs
 *          produces: [application/json]
 *          responses:
 *              200:
 *                  description: Successful operation
 *              400:
 *                  description: Bad request
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
*/
router.get("/", AdminBlogController.getAllBlogs)
/**
 * @swagger
 *  /admin/blog/{id}:
 *      get:
 *          tags : [Admin-Blog]
 *          description: Get blog by id
 *          produces: [application/json]
 *          parameters:
 *              - name: id
 *                in: path    
 *                description: id
 *                required: true
 *          responses:
 *              200:
 *                  description: Successful operation
 *              400:
 *                  description: Bad request
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
*/
router.get("/:id", AdminBlogController.getBlogById)
/**
 * @swagger
 *  /admin/blog/?search=:search:
 *      get:
 *          tags : [Admin-Blog]
 *          description: Get blog by search
 *          produces: [application/json]
 *          parameters:
 *              - name: search
 *                in: query  
 *                description: search
 *                required: true
 *          responses:
 *              200:
 *                  description: Successful operation
 *              400:
 *                  description: Bad request
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
*/
router.get("/?search", AdminBlogController.getBlogByQuery)
/**
 * @swagger
 *  /admin/blog:
 *      post:
 *          tags : [Admin-Blog]
 *          description: create blog
 *          produces: [application/json]
 *          parameters:
 *              - name: title
 *                in: input
 *                schema:
 *                      type: object
 *                required: true
 *                description: "title"
 *              - name: overview
 *                in: input
 *                schema:
 *                      type: object
 *                      maxLength: 60
 *                required: true
 *              - name: content
 *                in: input
 *                schema:
 *                      type: object
 *                      maxLength: 500
 *                required: true
 *              - name: tags
 *                in: input
 *                schema:
 *                      type: array
 *                required: true
 *              - name: category
 *                in: input
 *                schema:
 *                      type: object
 *                required: true
 *          responses:
 *              200:
 *                  description: Successful operation
 *              400:
 *                  description: Bad request
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
*/
router.post("/", imageUploader.single("image"), stringToArray("tags"), AdminBlogController.createBlog)
/**
 * @swagger
 *  /admin/blog/{id}:
 *      put:
 *          tags : [Admin-Blog]
 *          description: update blog
 *          produces: [application/json]
 *          parameters:
 *              - name :id
 *                in : path
 *                required :true
 *              - name: title
 *                in: input
 *                schema:
 *                      type: object
 *                required: true
 *                description: "title"
 *              - name: overview
 *                in: input
 *                schema:
 *                      type: object
 *                      maxLength: 60
 *                required: true
 *              - name: content
 *                in: input
 *                schema:
 *                      type: object
 *                      maxLength: 500
 *                required: true
 *              - name: tags
 *                in: input
 *                schema:
 *                      type: array
 *                required: true
 *              - name: category
 *                in: input
 *                schema:
 *                      type: object
 *                required: true
 *          responses:
 *              200:
 *                  description: Successful operation
 *              400:
 *                  description: Bad request
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
*/
router.put("/:id", AdminBlogController.editBlog)
/**
 * @swagger
 *  /admin/blog/{id}:
 *      delete:
 *          tags : [Admin-Blog]
 *          description: Get blog by search
 *          produces: [application/json]
 *          parameters:
 *              - name: id
 *                in: path
 *                schema:
 *                      type: string
 *                required: true
 *          responses:
 *              200:
 *                  description: Successful operation
 *              400:
 *                  description: Bad request
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
*/
router.delete("/:id", AdminBlogController.deleteBlog)
module.exports = {
    AdminBlogRoutes: router
}