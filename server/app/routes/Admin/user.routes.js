const router = require('express').Router();
const UserController = require('../../http/controllers/Admin/user.controller');
router.get('/', UserController.getAll);
router.post('/', UserController.createUser);
router.post('/ban-user/:id', UserController.banUser);
router.put('/:id', UserController.updateProfile);
router.get('/:id', UserController.getUser);
module.exports = {
  AdminUserRoutes: router,
};
