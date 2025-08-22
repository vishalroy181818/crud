const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs");
const session = require("express-session");
require("dotenv").config();
              



const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//ye .env file se export kiya ja rha hai
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URL;

// Schema + Model
const User = require("./models/user");//baaby resistration schema
const Admin = require("./models/admin");// admin schema hai ye

//signup to health care


app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "style", "signup.html"));
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await Admin.findOne({ email });
    if (exist) return res.send(" User already exists! <br><a href='/signup.html'>Try Again</a>");

    const hashedPass = await bcrypt.hash(password, 10);//10 leght password

    const newAdmin = new Admin({ name, email, password: hashedPass });
    await newAdmin.save();

    res.send(" Signup successful! <br><a href='/login.html'>Login Now</a>");
  } catch (err) {
    res.send(" Error in Signup: " + err);
  }
});
//login to health care

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // yahan error aata hai agar user.password undefined hai
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }


    res.redirect("/index.html");// login hone pr index acces ke lega
  } catch (err) {
    console.error("Error in Login:", err);
    res.status(500).send("Error in Login: " + err.message);// login nhi hua to erro de dega
  }
});
//logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send(" Logged out successfully! <br><a href='/login.html'>Login Again</a>");
  });
});



// home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"style", "front.html"));//serer ka home page jha signup and login button 
});


// static files (CSS)
app.use(express.static(path.join(__dirname, "style")));//ye file export krta hai like css
app.use(express.static(path.join(__dirname, "search")));


// MongoDB Connection
mongoose.connect(MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log(" MongoDB Connected"))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());



//sessiom setup
app.use(session({
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true
}));




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

//cheackauth
app.get("/checkAuth", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});


app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});




