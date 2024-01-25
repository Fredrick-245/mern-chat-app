const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatControllers")
const authController = require("./../middleware/authMiddleware")

const router  = express.Router()

router.route("/").post(authController.protect,chatController.accessChat).get(authController.protect,chatController.fetchChats)
router.route("/group").post(authController.protect,chatController.createGroupChat)
router.route("/renameGroup").patch(authController.protect,chatController.renameGroup)
router.route("/addUser").patch(authController.protect,chatController.addToGroup)
router.route("/removeUser").patch(authController.protect,chatController.removeFromGroup)


module.exports = router