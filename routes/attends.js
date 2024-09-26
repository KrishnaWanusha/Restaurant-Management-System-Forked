const express = require("express");
const Attends = require("../models/attends");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Save the password
router.post("/attend/save", async (req, res) => {
  try {
    let newAttends = new Attends(req.body);

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    newAttends.password = await bcrypt.hash(req.body.password, salt);

    await newAttends.save();
    return res.status(200).json({
      success: "Attend Saved success",
    });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
});

router.get("/attends", (req, res) => {
  Attends.find().exec((err, attends) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    return res.status(200).json({
      success: true,
      existingAttends: attends,
    });
  });
});

module.exports = router;
