const express = require("express");
const {
  verifyToken,
  apiLimiter,
  corsWhenDomailMatches,
} = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v2");

const router = express.Router();

router.use(corsWhenDomailMatches);

router.post("/token", apiLimiter, createToken); // req.body.clientSecret로 프론트에서 보내주기로 함
router.get("/test", verifyToken, apiLimiter, tokenTest); // 순서대로 실행되기 때문에 verifyToken 먼저 실행되게 함

router.get("/posts/my", verifyToken, apiLimiter, getMyPosts);
router.get("/posts/hashtag/:title", verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;
