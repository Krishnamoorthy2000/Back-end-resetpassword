const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const userSchema = require("../schema/schema");
const crypto = require("crypto");

require("dotenv").config();

// const secretKey = process.env.JWT_SECRET_KEY;
// const tokenExpiration = process.env.JWT_TOKEN_EXPIRATION;

// Generate a JSON Web Token (JWT) for password reset
// const generateResetToken = (email) => {
//   const token = jwt.sign({ email }, secretKey, { expiresIn: tokenExpiration });
//   return token;
// };

// Send a password reset email with the reset token
const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });

  const resetLink = `http://localhost:3000/forgotpassword/resetpassword/${token}`;
  const mailOptions = {
    from: process.env.FROM,
    to: email,
    subject: "Password Reset",
    html: `Click <a href="${resetLink}">here</a> to reset your password`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Password reset email sent:", info.response);
};

// Route to send a password reset email
router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user with the email exists in the database
    const user = await userSchema.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a reset token and save it to the user's document
    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetToken = resetToken;
    await user.save();

    // Send a password reset email with the reset token
    
    await sendResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.log("Error:", err);
    return res
      .status(500)
      .json({ message: "Error occurred while resetting password", err });
  }
});

// Route to reset password using the reset token
router.post("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find user with the reset token
    const user = await userSchema.findOne({ resetToken: token });
    if (!user) {
      console.log("Invalid or expired token");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Check if reset token has expired
    // const tokenExpirationDate = jwt.decode(token).exp;
    // const now = Math.floor(Date.now() / 1000); // convert current time to seconds
    // if (tokenExpirationDate < now) {
    //   console.log("Reset token has expired");
    //   return res.status(400).json({ message: "Reset token has expired" });
    // }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear the reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    await user.save();

    console.log("Password has been updated successfully");
    return res
      .status(200)
      .json({ message: "Password has been changed successfully" });
  } catch (err) {
    console.log("Error updating password:", err);
    return res.status(500).json({ message: "Error updating password" });
  }
});
module.exports = router;
