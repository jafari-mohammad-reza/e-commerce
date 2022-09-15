const router = require('express').Router();
const CategoryController = require('../../http/controllers/Admin/category.controller');
const {imageUploader} = require('../../utils/imageUtils');

router.get('/', CategoryController.getAllCategories);

router.get('/parents', CategoryController.getAllParentCategories);

router.get('/parents/:id', CategoryController.getParentCategoryById);

router.get('/:id', CategoryController.getCategoryById);

router.post('/', imageUploader.single('image'), CategoryController.createCategory);

router.put('/:id', imageUploader.single('image'), CategoryController.editCategory);

router.delete('/:id', CategoryController.removeCategory);

module.exports = {
  AdminCategoryRoutes: router,
};
