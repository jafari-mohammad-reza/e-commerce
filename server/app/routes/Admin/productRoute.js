const productController = require("../../http/controllers/Admin/product.controller");

const router = require("express").Router();

/**
 * @swagger
 *  /admin/product:
 *      get:
 *          description : Get all products
 *          tags : [Admin-Products]
 *          produces: [application/json]
 *          responses :
 *              200 :
 *                  description : Get all products
 *              500:
 *                  description : Internal Server Error
 * */
router.get("/", productController.getAllProduct)
/**
 * @swagger
 *  /admin/product/{id}:
 *      get:
 *          description : Get product by id
 *          tags : [Admin-Products]
 *          produces: [application/json]
 *          parameters : 
 *              - name :id  
 *                in : path
 *                required :true
 *          responses :
 *              200 :
 *                  description : Get  product
 *              500:
 *                  description : Internal Server Error
 * */
router.get("/:id", productController.getProductById)
/**
 * @swagger
 *  /admin/product:
 *      post:
 *          description : create product
 *          tags : [Admin-Products]
 *          produces: [application/json]
 *          responses :
 *              200 :
 *                  description : Get all products
 *              500:
 *                  description : Internal Server Error
 * */
router.post("/", productController.createProduct)
/**
 * @swagger
 *  /admin/product/{id}:
 *      put:
 *          description : update a product
 *          tags : [Admin-Products]
 *          produces: [application/json]
 *          parameters :
 *              - name: id
 *                in: path
 *                description: id
 *                required: true
 *          responses :
 *              200 :
 *                  description : Get all products
 *              500:
 *                  description : Internal Server Error
 * */
router.put("/:id", productController.editProduct)
/**
 * @swagger
 *  /admin/product/{id}:
 *      delete:
 *          description : delete a product
 *          tags : [Admin-Products]
 *          produces: [application/json]
 *          parameters :
 *              - name: id
 *                in: path
 *                description: id
 *                required: true
 *          responses :
 *              200 :
 *                  description : Get all products
 *              500:
 *                  description : Internal Server Error
 * */
router.delete("/:id", productController.removeProduct)
module.exports = {
    AdminProductRoutes: router
}