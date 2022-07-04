const roleController = require("../../http/controllers/Admin/role.controller")
const {stringToArray} = require("../../http/middleWares/StringToArray");

const router = require("express").Router()
router.get("/", roleController.getAllRoles);
router.post("/", stringToArray("permissions"), roleController.createRole);
router.delete("/:id", roleController.deleteRole);
router.patch("/:id", stringToArray("permissions"), roleController.updateRole);

module.exports = {
    AdminRoleRoutes: router
}