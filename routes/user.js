const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const owasp = require("owasp-password-strength-test");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
const router = express.Router();

// Rate limiter to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiter to the login route
router.post("/login", loginLimiter, async (req, res) => {
  const { empID, password } = req.body;

  // throw an error if secret not loaded through env
  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new Error("Something went wrong with environment variables");

  // Check if the user exists
  const user = await User.findOne({ empID });
  if (!user) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }

  // Check if the password is correct
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { empID: user.empID, id: user._id, role: user.role }, // Payload
    process.env.ACCESS_TOKEN_SECRET, // Secret key
    { expiresIn: "7d" } // Token expiration time (7 days)
  );

  // Respond with the token and success message
  res.status(200).json({
    message: "Login successful",
    token: token, // Send the token in the response
  });
});

router.post("/register", async (req, res) => {
  const { empID, password } = req.body;

  try {
    // A07: Check if the password is weak
    if (!owasp.test(password).strong) {
      return res.status(400).send("Password is too weak");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ empID });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this empID already exists" });
    }
    // Create a new user
    const newUser = new User({
      empID,
      password, // Save the hashed password, not the plain text
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
