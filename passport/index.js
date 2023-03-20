const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // user === exUser
    done(null, user.id); // user id만 추출
  });
  // 세션 { 1231293812093: 1 } { 세션쿠키: 유저아이디 } -> 메모리 저장돼요

  passport.deserializeUser((id, done) => {
    // id: 1
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers",
        }, // 팔로잉
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings",
        }, // 팔로워
      ],
    })
      .then((user) => done(null, user)) // req.user
      .catch((err) => done(err));
  });

  local();
  kakao();
};
