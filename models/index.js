const Sequelize = require("sequelize");

const fs = require("fs");
const path = require("path");

// const User = require("./user");
// const Post = require("./post");
// const Hashtag = require("./hashtag");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
db.sequelize = sequelize;

const basename = path.basename(__filename);
fs.readdirSync(__dirname) // models 폴더
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    ); // 숨김파일과 index.js 제외한 js 확장자 파일
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    console.log(file, model.name); // model.name은 클래스 이름 (User, Post, Hashtag)
    db[model.name] = model;
    model.initiate(sequelize);
  });

// initiate 전부 다 하고나서 associate 해야 함.
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db.User = User;
// db.Post = Post;
// db.Hashtag = Hashtag;
// User.initiate(sequelize);
// Post.initiate(sequelize);
// Hashtag.initiate(sequelize);
// User.associate(db);
// Post.associate(db);
// Hashtag.associate(db);

module.exports = db;
