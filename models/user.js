const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Define the User schema with empID and password fields
const UserSchema = new mongoose.Schema({
  empID: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Pre-save hook to hash the password before saving it to the database
UserSchema.pre("save", async function (next) {
  const user = this;
  // Only hash the password if it has been modified (or if it's new)
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next(); // Proceed to the next middleware or save the document
});

// Method to compare a candidate password with the hashed password in the database
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); // Compare the candidate password with the stored hashed password
};

module.exports = mongoose.model("User", UserSchema);
