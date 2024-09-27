const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = sequelize.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [3, 50],
        is: /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`-\s]+$/i,
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [1, 300],
        isEmail: true,
      },
    },
  },
  {
    tableName: "User",
    timestamps: true,
  }
);

const LoginOTP = sequelize.define("otp_login", {
  OTP: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expire: {
    type: DataTypes.DATE,
  },
  refresh_count: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    min: 0,
  },
  next_attempt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
});

User.hasOne(LoginOTP, {
  foreignKey: "userId",
  as: "loginOTP",
  onDelete: "CASCADE",
});

LoginOTP.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = { User, LoginOTP };
