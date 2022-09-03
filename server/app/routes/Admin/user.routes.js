const router = require("express").Router()
const UserController = require("../../http/controllers/Admin/user.controller")
router.put("/:id", UserController.updateProfile)
router.get("/", UserController.getAll)
router.get("/:id", UserController.getUser)
router.post("/" , UserController.createUser)
module.exports = {
    AdminUserRoutes: router
}