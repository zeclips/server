const express = require('express');
const router = express.Router();
const  {getList, addPost, delPost, upvotePost, downvotePost} = require('../controllers/posts');
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getList);

router.route("/").post(protect, addPost);

router.route("/:post").delete(protect, delPost);

router.route("/:post/upvote").patch(protect, upvotePost);

router.route("/:post/downvote").patch(protect, downvotePost);

module.exports = router