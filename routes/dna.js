const express = require('express');
const router = express.Router();
const  {getList, requestDna, deliverDna } = require('../controllers/dna');
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getList);

router.route("/").post(protect, requestDna);

router.route("/:dnatestid/deliver").put(protect, deliverDna);


module.exports = router