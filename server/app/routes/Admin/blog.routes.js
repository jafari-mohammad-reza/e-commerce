const router = require('express').Router();
const AdminBlogController = require('../../http/controllers/Admin/blog.controller');
const {imageUploader} = require('../../utils/imageUtils');
const {stringToArray} = require('../../http/middleWares/StringToArray');
const {cache} = require('../../http/middleWares/redisCaching');


router.get('/', AdminBlogController.getAllBlogs);

router.get('/:id', cache('id'), AdminBlogController.getBlogById);

router.get('/?search', AdminBlogController.getBlogByQuery);
router.post('/', imageUploader.single('image'), stringToArray('tags'), AdminBlogController.createBlog);

router.put('/:id', imageUploader.single('image'), stringToArray('tags'), AdminBlogController.editBlog);

router.delete('/:id', AdminBlogController.deleteBlog);
module.exports = {
  AdminBlogRoutes: router,
};
