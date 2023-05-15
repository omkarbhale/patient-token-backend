const express = require("express");

const router = express.Router();

const {
	getAllTokens,
	getActiveToken,
	nextToken,
	addUser,
} = require("../controllers/token");

router.get("/", getAllTokens);
router.get("/active", getActiveToken);
router.post("/next", nextToken);
router.post("/user", addUser);

module.exports = router;
