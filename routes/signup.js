const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userSchema = require("../schema/schema");

// Check if user with the same email already exists
const existinguser = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await userSchema.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "user with this email already exists" });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Hash the password
const hashPassword = async (req, res, next) => {
  const { password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error to create hashPassword" });
  }
};

// Sign up new user
router.post("/", existinguser, hashPassword, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = new userSchema({ firstName, lastName, email, password });
    await user.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error in signup new user" });
  }
});

module.exports = router;
