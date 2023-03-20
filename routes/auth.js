const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { join, login, logout } = require("../controllers/auth");

router.post("/join", isNotLoggedIn, join);
router.post("/login", isNotLoggedIn, login);
router.get("/logout", isLoggedIn, logout);

// /auth/kakao -> 카카오톡 로그인 화면 -> /auth/kakao/callback

// /auth/kakao
router.get("/kakao", passport.authenticate("kakao")); // 카카오톡 로그인 화면으로 redirect

// /auth/kakao/callback 카카오톡 로그인 화면에서 아이디 비밀번호 입력 후 다시 redirect
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/?loginError=카카오로그인 실패",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
