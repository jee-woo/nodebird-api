const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

exports.join = async (req, res, next) => {
  const { nick, email, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12); // 길수록 보안에 좋은데 느려진디.
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/"); // 302
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    // done 호출되는 부분
    if (authError) {
      // 서버 실패
      console.error(authError);
      return next(authError); // 서버 에러는 next로 넘겨서 에러처리 미들웨어가 처리하도록 한다.
    }
    if (!user) {
      // 성공유저가 false일 경우 (로직 실패)
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        // 혹시나 로그인 과정에서 에러 날 수 있으니
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다. (미들웨어 확장 패턴)
};

exports.logout = (req, res) => {
  // { 세션쿠키: 유저아이디 } 지워버림
  req.logout(() => {
    res.redirect("/");
  });
};
