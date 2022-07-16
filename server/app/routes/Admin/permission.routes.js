const router = require("express").Router()
const PermissionController = require("../../http/controllers/Admin/permission.controller")
router.get("/", PermissionController.getAllPermissions)
router.get("/:id", PermissionController.getById)
router.post("/", PermissionController.createPermission)
router.put("/:id", PermissionController.updatePermission)
router.delete("/:id", PermissionController.deletePermission)

module.exports = {
    AdminPermissionRoutes: router
}


