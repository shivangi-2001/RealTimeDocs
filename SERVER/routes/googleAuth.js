const { default: axios } = require("axios");
const { oauth2Client } = require("../utilities/googleconfig");
const { HandleValidationError } = require("../utilities/validationError")

const GoogleLogin = async (req, res) => {
    try {
        const { code } = req.query;
        const googleRes = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(googleRes.tokens)
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)
        const {email, verified_email, given_name, picture} = userRes.data;
        let exist_user = await User.findOne({where: {email}})
        if(!exist_user && verified_email) {
            exist_user = await User.create({email, username:given_name })
            await exist_user.save()
        }
        const token = await GenerateToken(exist_user.id)
        return res.status(200).json({ message: "Login" , token});

    } catch (error) {
        HandleValidationError(error, res)
    }
}

const express = require('express');
const { User } = require("../model/user");
const { GenerateToken } = require("../utilities/generateToken");
const route = express.Router()

route.get('/google', GoogleLogin)

module.exports = route;