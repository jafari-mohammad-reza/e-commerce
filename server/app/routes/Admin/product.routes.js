const productController = require("../../http/controllers/Admin/product.controller");

const router = require("express").Router();


router.get("/", productController.getAllProduct);

router.get("/:id", productController.getProductById);

router.post("/", productController.createProduct);

router.put("/:id", productController.editProduct);

router.delete("/:id", productController.removeProduct);
module.exports = {
    AdminProductRoutes: router,
};

