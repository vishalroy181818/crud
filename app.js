const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// static files (CSS)
//app.use(express.static("index"));
app.use(express.static(path.join(__dirname, "style")));
app.use(express.static(path.join(__dirname, "search")));


// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));


// Schema + Model
const User = require("./models/user");

// Serve HTML Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"style", "index.html"));
});

// Save User
app.post("/save", async (req, res) => {
  try {
    
    
    const newUser = new User({
      name: req.body.name,
      phone: req.body.phone,
      Fname: req.body.fname,
      Mname: req.body.Mname,
      dob: req.body.dob,
      email: req.body.email,
      date: req.body.date,
      id: req.body.phone
    });
    await newUser.save();
    res.send(" Data Saved Successfully! <br><a href='/'>Go Back</a>");
  } catch (err) {
    res.send(" Error saving data: " + err);
  }
});


// Search User by Phone

app.get("/search", async (req, res) => {
  try {
    const phone = req.query.phone;
    const user = await User.findOne({ phone: phone });

    if (!user) {
      return res.send(" No user found <br><a href='/'>Go Back</a>");
    }

    // Redirect to searchResult.html with query params
    res.redirect(
      `./search.html?name=${user.name}&id=${user.phone}&dob=${user.dob}&father=${user.Fname}&mother=${user.Mname}&email=${user.email}&phone=${user.phone}&date=${user.date}`
    );
  } catch (err) {
    res.send("Error searching: " + err);
  }
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});




