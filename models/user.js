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
  email: { type: String, unique: true },
  //password: String
});

module.exports = mongoose.model("user", UserSchema);

//signup
