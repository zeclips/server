const express = require('express');
const router = express.Router();
const  {/*getList,*/getPublicGroups, leaveGroup, getGroup, createGroup, joinGroup, messageGroup, getGroupMessages} = require('../controllers/groups');
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getGroup);

router.route("/public").get(protect, getPublicGroups);

router.route("/").post(protect, createGroup);

router.route("/:groupId").put(protect, joinGroup);

router.route("/:groupId").patch(protect, leaveGroup);

router.route("/:groupId/message").post(protect, messageGroup);

router.route("/:groupId/message").get(protect, getGroupMessages);

module.exports = router