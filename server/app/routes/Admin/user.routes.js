const router = require('express').Router();
const UserController = require('../../http/controllers/Admin/user.controller');
const {cache} = require('../../http/middleWares/redisCaching');
router.get('/', UserController.getAll);
router.post('/', UserController.createUser);
router.post('/ban-user/:id', UserController.banUser);
router.put('/:id', UserController.updateProfile);
router.get('/:id', cache('id'), UserController.getUser);
module.exports = {
  AdminUserRoutes: router,
};
