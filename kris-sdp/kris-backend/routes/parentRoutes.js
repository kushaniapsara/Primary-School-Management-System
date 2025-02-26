const express = require("express");
const { getParents } = require("../controllers/parentController");

const router = express.Router();

router.get("/", getParents);

module.exports = router;
