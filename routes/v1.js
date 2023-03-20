const express = require("express");
const { verifyToken } = require("../middlewares");
const { createToken, tokenTest } = require("../controllers/v1");

const router = express.Router();

router.post("/token", createToken); // req.body.clientSecret로 프론트에서 보내주기로 함
router.get("/test", verifyToken, tokenTest);

module.exports = router;
