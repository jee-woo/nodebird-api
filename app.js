const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");
const { sequelize } = require("./models");

// 여기까지는 process.env 없음
dotenv.config(); // process.env 사용
// 여기부터만 process.env 있음

const authRouter = require("./routes/auth");
const indexRouter = require("./routes");
const v1Router = require("./routes/v1");
const v2Router = require("./routes/v2");

const passportConfig = require("./passport");

const app = express();
passportConfig();
app.set("port", process.env.PORT || 8002);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
sequelize
  .sync({ force: false }) // true일 경우 테이블 잘못 만들었을 때 서버 재시작하면 테이블 다 제거되고 다시 생성됨 (개발 시에만 사용하세요)
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev")); // logger
app.use(express.static(path.join(__dirname, "public"))); // public 폴더를 static 폴더로 만들어서 프론트에서 이 폴더에 접근할 수 있게 함

// body parsers
app.use(express.json()); // req.body를 ajax 요청으로부터
app.use(express.urlencoded({ extended: false })); // req.body를 폼으로부터
app.use(cookieParser(process.env.COOKIE_SECRET)); // { connect.sid: 1231293812093 } 객체로 만들어줌

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false, // 나중엔 true로 바꿔서 https 사용
    },
  })
);
// passport 미들웨어는 무조건 express session 밑에 붙여야 함
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout 이 여기서 생기는 거다
app.use(passport.session()); // 세션이 만들어지고 connect.sid 라는 이름으로 세션 쿠키가 브라우저로 전송됨
// 브라우저 connect.sid=1231293812093

app.use("/auth", authRouter);
app.use("/", indexRouter);
app.use("/v1", v1Router);
app.use("/v2", v2Router);

app.use((req, res, next) => {
  // 404 NOT FOUND
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {}; // 에러 로그를 서비스한테 넘긴다
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
