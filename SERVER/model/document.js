const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Document = sequelize.define(
  "document",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    tableName: "document",
    timestamps: true,
  }
);

module.exports = { Document };
