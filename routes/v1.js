const express = require("express");
const { verifyToken, deprecated } = require("../middlewares");
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v1");

const router = express.Router();

router.use(deprecated); // 밑에 라우터 전부에 미들웨어 적용

router.post("/token", createToken); // req.body.clientSecret로 프론트에서 보내주기로 함
router.get("/test", verifyToken, tokenTest);

router.get("/posts/my", verifyToken, getMyPosts);
router.get("/posts/hashtag/:title", verifyToken, getPostsByHashtag);

module.exports = router;
