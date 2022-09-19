const roleController = require('../../http/controllers/Admin/role.controller');
const {cache} = require('../../http/middleWares/redisCaching');

const router = require('express').Router();
router.get('/', roleController.getAllRoles);
router.post('/', roleController.createRole);
router.get('/:id', cache('id'), roleController.getRoleById);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = {
  AdminRoleRoutes: router,
};
