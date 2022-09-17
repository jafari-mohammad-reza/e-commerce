const roleController = require('../../http/controllers/Admin/role.controller');
const {cache} = require('../../http/middleWares/redisCaching');

const router = require('express').Router();
router.get('/', roleController.getAllRoles);
router.get('/:id', cache('id'), roleController.getRoleById);
router.post('/', roleController.createRole);
router.delete('/:id', roleController.deleteRole);
router.put('/:id', roleController.updateRole);

module.exports = {
  AdminRoleRoutes: router,
};
