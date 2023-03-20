const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
        passReqToCallback: false,
      },
      // passReqToCallback: true면 여기서 첫번째 인자에 콜백함수(req)가 들어감
      async (email, password, done) => {
        // done(서버실패, 성공유저, 로직실패)
        // 호출되는 순간 auth 컨트롤러에서 passport.authenticate('local', (authError, user, info) => {여기가 실행됨})
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser); // 서버실패 = null, 성공유저 = exUser
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." }); // 서버실패 = null, 성공유저 = false, 로직실패 (이유) = {message}
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error); // 서버실패
        }
      }
    )
  );
};
