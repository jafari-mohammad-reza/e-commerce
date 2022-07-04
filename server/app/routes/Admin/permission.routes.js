const router = require("express").Router()
const PermissionController = require("../../http/controllers/Admin/permission.controller")
router.get("/", PermissionController.getAllPermissions)
router.post("/", PermissionController.createPermission)
router.patch("/:id", PermissionController.updatePermission)
router.delete("/:id", PermissionController.deletePermission)

module.exports = {
    AdminPermissionRoutes: router
}


