const Sequelize = require("sequelize");

// 모델 코드만 바꾼다고 db가 바뀌는게 아님. 수정 필요 시 워크벤치나 마이그레이션 이용해서 수정해야 함.
// 개발 단계에서는 테이블 다 지우고 다시 실행하는 걸 추천
class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true, // 카카오 로그인 구현할거기 때문
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100), // 비밀번호가 암호화되면 길어짐
          allowNull: true,
        },
        provider: {
          type: Sequelize.ENUM("local", "kakao"), // local, kakao 중 하나의 값 저장
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        // 여기서부터는 option
        // email, snsId 둘 중 하나는 있어야 함.
        sequelize,
        timestamps: true, // createdAt, updatedAt 자동으로 기록
        underscored: false, // true일 경우 created_at, updated_at
        modelName: "User", // js에서 이름
        tableName: "users", // db에서 이름
        paranoid: true, // deletedAt 유저 삭제일. 이 정보가 있으면 탈퇴한 유저 (soft delete. 반대로 db에서 지워버리면 hard delete)
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post); // 일대다

    // 다대다. 둘 다 테이블 이름이 User이기 때문에 헷갈릴 수 있으니 foreignKey, as를 적어준다
    db.User.belongsToMany(db.User, {
      // 팔로워
      foreignKey: "followingId",
      as: "Followers", // 다대다 테이블
      through: "Follow", // 중간 테이블
    });
    db.User.belongsToMany(db.User, {
      // 팔로잉
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });
    db.User.hasMany(db.Domain);
  }
}

module.exports = User;
