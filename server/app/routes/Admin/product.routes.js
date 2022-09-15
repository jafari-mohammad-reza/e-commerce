const productController = require('../../http/controllers/Admin/product.controller');
const {stringToArray} = require('../../http/middleWares/StringToArray');
const {imageUploader} = require('../../utils/imageUtils');

const router = require('express').Router();


router.get('/', productController.getAllProduct);

router.get('/:id', productController.getProductById);

router.post('/', imageUploader.array('images', 6), stringToArray('tags'), productController.createProduct);

router.put('/:id', imageUploader.array('images', 6), stringToArray('tags'), productController.editProduct);

router.delete('/:id', productController.removeProduct);
module.exports = {
  AdminProductRoutes: router,
};

