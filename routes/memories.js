const express = require('express');
const router = express.Router();
const  {getList, addTodo, delTodo, doTodo, undoTodo} = require('../controllers/todolist');
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getList);

router.route("/").post(protect, addTodo);

router.route("/:todoItem").delete(protect, delTodo);

router.route("/:todoItem/do").put(protect, doTodo);

router.route("/:todoItem/undo").put(protect, undoTodo);

module.exports = router