const express = require("express")
const userController = require("./../controllers/userController")
const authController = require("./../middleware/authMiddleware")

const router = express.Router()
router.route("/").post(userController.registerUser).get(authController.protect,userController.searchUser)
router.route("/login").post(userController.authUser)

module.exports = router