const router = require("express").Router();
const CategoryController = require("../../http/controllers/Admin/category.controller")
/**
 * @swagger
 *  /admin/category:
 *      get:
 *          tags : [Admin-Category]
 *          description: Get all categories
 *          produces: [application/json]
 *          responses:
 *                  200:
 *                      description: Successful operation
 *                  400:
 *                      description: Bad request
 *                  404:
 *                      description: Not found
 *                  500:
 *                      description: Internal server error
 *                                  
*/
router.get("/", CategoryController.getAllCategories)
/**
 * @swagger
 *  /admin/category/parents:
 *      get:
 *          tags : [Admin-Category]
 *          description: Get all parent categories
 *          produces: [application/json]
 *          responses:
 *                  200:
 *                      description: Successful operation
 *                  400:
 *                      description: Bad request
 *                  404:
 *                      description: Not found
 *                  500:
 *                      description: Internal server error
 *                                  
*/
router.get("/parents", CategoryController.getAllParentCategories)
/**
 * @swagger
 *  /admin/{id}:
 *      get:
 *          tags : [Admin-Category]
 *          description: Get category by id
 *          produces: [application/json]
 *          parameters: 
 *              - name: id
 *                in: params
 *                description: id
 *                required: true
 *          responses:
 *                  200:
 *                      description: Successful operation
 *                  400:
 *                      description: Bad request
 *                  404:
 *                      description: Not found
 *                  500:
 *                      description: Internal server error
 *                                  
*/
router.get("/:id", CategoryController.getCategoryById)
/**
 * @swagger
 *  /admin/category/parents/{id}:
 *      get:
 *          tags : [Admin-Category]
 *          description: Get parent category by id
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
 *                                  
*/
router.get("/parents/:id", CategoryController.getParentCategoryById)
/**
 * @swagger
 *  /admin/category:
 *      post:
 *          tags : [Admin-Category]
 *          description: Create category
 *          produces: [application/json]
 *          parameters:
 *              - name: id
 *                in: path
 *                description: id
 *                required: true
 *              - in: body
 *                name: title
 *                description: "Title"
 *                required: true
 *                schema:
 *                      type: string
 *              - in: body
 *                name: parent
 *                description: "parent"
 *                required: true
 *                schema:
 *                      type: string
*/
router.post("/", CategoryController.createCategory)
/**
 * @swagger
 *  /admin/category/{id}:
 *      patch:
 *          tags : [Admin-Category]
 *          description: edit category
 *          produces: [application/json]
 *          parameters:
 *                  - in: input
 *                    name: title
 *                    description: "title"
 *                    required: true
 *                    schema:
 *                        type: string
 *                  - in: input
 *                    name: parent
 *                    description: "parent"
 *                    required: true
 *                    schema:
 *                        type: string
 *          responses:
 *                  200:
 *                      description: Successful operation
 *                  400:
 *                      description: Bad request
 *                  404:
 *                      description: Not found
 *                  500:
 *                      description: Internal server error
 *                                  
*/
router.patch("/:id", CategoryController.editCategory)
/**
 * @swagger
 *  /admin/category/{id}:
 *      delete:
 *          tags : [Admin-Category]
 *          description: delete category
 *          produces: [application/json]
 *          parameters:
 *              - name: id
 *                in: path
 *                description: id
 *                required: true
 *              - in: input
 *                name: id
 *                description: "id"
 *                required: true 
 *          responses:
 *                  200:
 *                      description: Successful operation
 *                  400:
 *                      description: Bad request
 *                  404:
 *                      description: Not found
 *                  500:
 *                      description: Internal server error
 *                                  
*/
router.delete("/:id", CategoryController.removeCategory)

module.exports = {
    AdminCategoryRoutes: router
}