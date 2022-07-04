const router = require("express").Router()
const UserController = require("../../http/controllers/Admin/user.controller")
router.patch("/", UserController.updateProfile)
router.get("/", UserController.getAll)

module.exports = {
    AdminUserRoutes: router
}