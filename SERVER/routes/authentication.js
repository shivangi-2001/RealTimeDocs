const otpGenerator = require("otp-generator");
const { send_email } = require("../utilities/send_email.js");
const { User, LoginOTP } = require("../model/user.js");
const express = require("express");
const routes = express.Router();
const {HandleValidationError: ValidationError} = require('../utilities/validationError.js');
const { GenerateToken } = require("../utilities/generateToken.js");

routes.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    const exist_user = await User.findOne({ where: { email } });
    if (!exist_user) {
      const new_user = await User.create({ email });
      return res.status(200).json({ new_user, message: "OK" });
    }

    let OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: true,
      specialChars: true,
    });

    let expire_date = Date.now() + 15 * 60 * 1000;

    const logged_user = await LoginOTP.findOne({
      where: { userId: exist_user.id },
    });

    if (!logged_user) {
      const otp_user = await LoginOTP.create({
        OTP,
        expire: expire_date,
        userId: exist_user.id,
        refresh_count: 3,
      });

      let text = `One Time password: ${OTP} expire: ${otp_user.expire.toLocaleString()}`;
      await send_email({ email, text });
      return res.status(200).json({ message: "OTP sent to your email" });
    } else {
      return res
        .status(200)
        .json({ message: "Check your email inbox or spam" });
    }
  } catch (error) {
    ValidationError(error, res);
  }
});

routes.post("/verify_otp", async (req, res) => {
  try {
    let { email } = req.query;
    let { user_otp } = req.body;
    const exist_user = await User.findOne({ where: { email } });
    
    if (!exist_user) {
      return res.status(400).json({ error_message: "User does not found" });
    }
    
    const logged_user = await LoginOTP.findOne({
      where: { userId: exist_user.id },
    });

    if (!logged_user) {
      return res.status(400).json({ error_message: "No OTP record found" });
    }

    // Check if the OTP attempt is within allowed time
    if (logged_user.next_attempt && Date.now() < logged_user.next_attempt) {
      const retryAfter = new Date(logged_user.next_attempt) - Date.now();
      return res.status(400).json({
        error_message: `Try again after ${new Date(logged_user.next_attempt).toLocaleTimeString()}. Retry in ${Math.ceil((retryAfter / 1000/60))} minutes.`,
      });
    }

    if (logged_user.expire < new Date()) {
      return res.status(400).json({ error_message: "OTP is expired" });
    }

    if (
      logged_user.OTP === user_otp &&
      logged_user.refresh_count >= 0 &&
      new Date() <= logged_user.expire
    ) {
      await logged_user.destroy();
      const token = await GenerateToken(exist_user['id'])
      return res.status(200).json({ message: "Login" , token});
    }

    // Handle invalid OTP or expired OTP cases
    if (logged_user.refresh_count > 0) {
      logged_user.refresh_count -= 1;
      await logged_user.save();
    }

    if (logged_user.refresh_count === 0) {
      const next_attempt_time = Date.now() + 30 * 60 * 1000;
      logged_user.next_attempt = next_attempt_time;
      await logged_user.save();
      return res.status(400).json({
        error_message: `Try again after ${new Date(next_attempt_time).toLocaleString()}`,
      });
    }

    return res.status(400).json({
      error_message: `Invalid OTP, Number of attempts left: ${logged_user.refresh_count}`,
    });
  } catch (error) {
    ValidationError(error, res);
  }
});

routes.get("/resend_otp", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error_message: "Email is required." });
    }

    const exist_user = await User.findOne({ where: { email } });
    if (!exist_user) {
      return res.status(400).json({ error_message: "User not found." });
    }

    const logged_user = await LoginOTP.findOne({
      where: { userId: exist_user.id },
    });

    if (!logged_user) {
      return res.status(400).json({ error_message: "No OTP record found." });
    }

    if (logged_user.refresh_count <= 0 && new Date() < logged_user.next_attempt) {
      return res.status(400).json({ error_message: `Cannot Resend OTP. Please try again later. - ${logged_user.next_attempt.toLocaleTimeString()}` });
    }

    if(new Date() >= logged_user.next_attempt){
      logged_user.refresh_count = 3
      logged_user.next_attempt = null
      await logged_user.save()
    }

    if (logged_user.refresh_count > 0 || !logged_user.next_attempt || new Date() >= logged_user.next_attempt) {
      let OTP = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: true,
        specialChars: true,
      });

      let expire_date = new Date(Date.now() + 15 * 60 * 1000); // Expiry in 15 minutes
      logged_user.OTP = OTP;
      logged_user.expire = expire_date;
      logged_user.refresh_count = logged_user.refresh_count > 0 ? logged_user.refresh_count - 1 : 0;
      logged_user.next_attempt = null; // Clear next_attempt as OTP is being refreshed
      await logged_user.save();

      let text = `One Time Password: ${OTP} expires at: ${expire_date.toLocaleString()}`;
      
      try {
        await send_email({ email, text });
      } catch (emailError) {
        return res.status(500).json({ error_message: "Failed to send email." });
      }

      return res.status(200).json({
        message: `New OTP send to email: ${email}, attempts left: ${logged_user.refresh_count}`,
      });
    }

    return res.status(400).json({
      error_message: "Cannot refresh OTP. Please try again later.",
    });
  } catch (error) {
    ValidationError(error, res);
  }
});


routes.post("/set_profile", async (req, res) => {
  try {
    const { username } = req.body;
    let { email } = req.query;
    const exist_user = await User.findOne({ where: { email } });
    if (!exist_user) {
      return res.status(404).json({ error_message: "User does not exist" });
    }
    exist_user.username = username;
    await exist_user.save();

    let OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: true,
      specialChars: true,
    });

    let expire_date = Date.now() + 15 * 60 * 1000;
    await LoginOTP.create({
      OTP,
      expire: expire_date,
      userId: exist_user.id,
      refresh_count: 3,
    });

    let text = `Profile created successfully! One Time password: ${OTP} expires at: ${new Date(
      expire_date
    ).toLocaleString()}`;
    await send_email({ email, text });

    return res.status(200).json({
      message: `OTP for ${email} successfully sent to your email inbox`,
    });
  } catch (error) {
    ValidationError(error, res);
  }
});

routes.get('/skip_set_profile', async (req, res) => {
  try {
    let { email } = req.query;
    const exist_user = await User.findOne({ where: { email } });
    if (!exist_user) {
      return res.status(404).json({ error_message: "User does not exist" });
    }
    let OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: true,
      specialChars: true,
    });

    let expire_date = Date.now() + 15 * 60 * 1000;
    await LoginOTP.create({
      OTP,
      expire: expire_date,
      userId: exist_user.id,
      refresh_count: 3,
    });

    let text = `One Time password: ${OTP} expires at: ${new Date(
      expire_date
    ).toLocaleString()}`;
    await send_email({ email, text });

    return res.status(200).json({
      message: `OTP for ${email}, successfully sent to your email inbox`,
    });

  } catch (error) {
    return ValidationError(error, res);
  }
});


module.exports = routes;
