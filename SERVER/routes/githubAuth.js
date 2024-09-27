const { HandleValidationError } = require("../utilities/validationError");
require("dotenv").config();
const axios = require("axios");
const express = require("express");
const { User } = require("../model/user");
const { GenerateToken } = require("../utilities/generateToken");
const route = express.Router();

// GitHub OAuth login handler
const githubAuth = async (req, res) => {
  const clientID = process.env.GITHUB_CLIENT_ID;
  const redirectURI = "http://localhost:5173/auth/github";
  const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=user:email`;

  res.redirect(githubAuthURL);
};

// Exchange GitHub code for access token
const exchangeCodeForToken = async (code) => {
  const clientID = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: clientID,
      client_secret: clientSecret,
      code: code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response.data.access_token;
};

// Fetch user data from GitHub using access token
const fetchGitHubUserData = async (accessToken) => {
  const response = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "YourAppName",
    },
  });
  const emailsResponse = await axios.get("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "YourAppName",
    },
  });

  return { user: response.data, email: emailsResponse.data[0] };
};

// Routes
route.get("/github", githubAuth);

route.get("/github/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    const accessToken = await exchangeCodeForToken(code);
    const { user, email } = await fetchGitHubUserData(accessToken);

    let exist_user = await User.findOne({ where: { email: email.email } });
    if (!exist_user) {
      exist_user = await User.create({
        email: email.email,
        username: user.login,
      });
      await exist_user.save();
    }
    const token = await GenerateToken(exist_user.id);
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return HandleValidationError(error, res);
  }
});

module.exports = route;
