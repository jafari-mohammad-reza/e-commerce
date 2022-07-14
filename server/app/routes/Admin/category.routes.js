const router = require("express").Router();
const CategoryController = require("../../http/controllers/Admin/category.controller")

router.get("/", CategoryController.getAllCategories)

router.get("/parents", CategoryController.getAllParentCategories)

router.get("/parents/:id", CategoryController.getParentCategoryById)

router.get("/:id", CategoryController.getCategoryById)

router.post("/", CategoryController.createCategory)

router.put("/:id", CategoryController.editCategory)

router.delete("/:id", CategoryController.removeCategory)

module.exports = {
    AdminCategoryRoutes: router
}