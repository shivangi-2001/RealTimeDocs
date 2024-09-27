const jwt = require("jsonwebtoken");
const { User } = require("../model/user");

async function ValidateAuth(req, res, next) {
  const auth_header = req.headers["authorization"];
  if (auth_header && auth_header.startsWith("Bearer")) {
    try {
      const token = auth_header.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ error_message: "Unauthorized, Something went wrong" });
      }
      jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
          return res
            .status(403)
            .json({ error_message: "Forbidden, Unauthorized Login again" });
        }
        let current_user = await User.findOne({ where: { id: user.data } });
        if (current_user) req.user = user.data;
        req.user.email = current_user.email;
        next();
      });
    } catch (error) {
      return res.status(500).json({ error_message: "Internal server Error" });
    }
  } else {
    return res.status(401).json({ error: "Login Again" });
  }
}

module.exports = { ValidateAuth };
