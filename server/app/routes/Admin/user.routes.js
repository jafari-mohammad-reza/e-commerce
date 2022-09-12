const router = require("express").Router()
const UserController = require("../../http/controllers/Admin/user.controller")
const {VerifyAccessToken} = require("../../http/middleWares/TokenAuthorization");
router.put("/:id", UserController.updateProfile)
router.get("/", UserController.getAll)
router.get("/:id", UserController.getUser)
router.post("/", UserController.createUser)
module.exports = {
    AdminUserRoutes: router
}
