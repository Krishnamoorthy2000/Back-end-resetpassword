const express = require("express");
const router = express.Router();
const userSchema = require("../schema/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "Abjbswh@%^&!hdbjsb";

// create the token

const createToken = async (payload) => {
  let token = await jwt.sign(payload, secretKey);
  return token;
};

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let token = await createToken({
      email: user.email,
      password:user.password,
      id: user._id,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
