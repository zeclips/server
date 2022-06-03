const express = require('express');
const router = express.Router();
const  {/*getList,*/getPublicTrees, leaveTree, getTree, createTree, joinTree} = require('../controllers/tree');
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getTree);

router.route("/public").get(protect, getPublicTrees);

router.route("/").post(protect, createTree);

router.route("/:treeId").put(protect, joinTree);

router.route("/:treeId").patch(protect, leaveTree);

module.exports = router