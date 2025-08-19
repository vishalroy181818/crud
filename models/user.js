const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  Fname: String,
  Mname: String,
  dob: String,
  phone: String,
  email: String,
  date: String,
  id:String,
});

module.exports = mongoose.model("User", UserSchema);
