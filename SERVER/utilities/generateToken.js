require("dotenv").config();
const jwt = require("jsonwebtoken");

const GenerateToken = (id) => {
  try {
    const token = jwt.sign({ data: id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return token;
  } catch (error) {
    ("Error generating token:", error);
    return null;
  }
};

module.exports = { GenerateToken };
