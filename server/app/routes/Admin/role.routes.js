const roleController = require("../../http/controllers/Admin/role.controller")
const {stringToArray} = require("../../http/middleWares/StringToArray");

const router = require("express").Router()
router.get("/", roleController.getAllRoles);
router.get("/:id", roleController.getRoleById);
router.post("/", roleController.createRole);
router.delete("/:id", roleController.deleteRole);
router.put("/:id", roleController.updateRole);

module.exports = {
    AdminRoleRoutes: router
}