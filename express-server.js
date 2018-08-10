// dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

// Global const for the app
const PORT = process.env.PORT || 8080; // default port 8080


// URLs Databse 
const urlDatabase = {
  "b2xVn2": "http://lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Users Database
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "asdf"
  },
 "userRandomID2": {
    id: "userRandomID2", 
    email: "email@email.com", 
    password: "asdf"
  }
};

// Setup express app
const app = express();

// Setup middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

// view enginge
app.set('view engine', 'ejs');

// function to generate a six charecter random string 
// disclosure: this code snippet was copied from stackoverflow 
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
// function to loop over users database to check for duplicate emails if true returns user object
function getUser(enteredEmail) {
  for (let user in users ) {
    if (users[user].email === enteredEmail) {
      return users[user];
    }
  } 
  return false;
}
// possibly not needed
// Function to loop over Users database to check for password matches on login
// function passwordValidation(enteredPassword) {
//   for (let i in users) {
//     if (users[i].password === enteredPassword) {
//       return true;
//     } else return false;
//   }
// }

// App routes 
// Get - home route
app.get("/urls", (req, res) => {
  let templateVars = {
    user_id: req.cookies.user_id,
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// Get - new URL route - /url_new
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user_id: req.cookies.id,
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
  // res.redirect("/urls");
});

// Get - register route ===> registration form /urls/register
app.get("/urls/register", (req, res) => {
  let templateVars = {
    user_id: req.cookies.id,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_register", templateVars);
});

// Get - Login route - /urls_login
app.get("/login", (req, res) => {
  let templateVars = {
    user_id: req.cookies.id,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };

  res.render("urls_login", templateVars);
});

// Get - Show individual URL route - /url_show
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    user_id: req.cookies.id,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

// Post - delete url route
app.post("/urls/:id/delete", (req, res) => {
  let templateVars = {
    user_id: req.cookies.id,
    urls: urlDatabase
  };
  // console.log(urlDatabase[req.params.id]);
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});


// Get - not sure why this is here
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Post - Home route to add new url - '/urls/ 
app.post("/urls", (req, res) => {
  // console.log(req.body); // debug statement to see POST parameters
  let newid = generateRandomString();
  urlDatabase[newid] = req.body.longURL;
  res.redirect("/urls");
});

// Post - this will update the value entered in text box
app.post("/urls/shortURL", (req, res) => {
  urlDatabase[req.body.shortURL] = req.body.longURL;
  // res.send("ok");
  res.redirect("/urls");
});

// Post - Login route ===> user username cookie
app.post("/login", (req, res) => {
  const {email, password} = req.body;
  let thisuser = getUser(email);
  // console.log(passwordCheck);

  // if (email === "" || password === "") {
  //   res.sendStatus(400);
  if (!thisuser) {
    res.sendStatus(403);
  } else if (thisuser.password !== password) {
    res.sendStatus(403);
  } else {
    res.cookie("user_id", thisuser.id);
    res.redirect("/urls");
  }
});

// Post - Logout route ===> clear username cookie
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// Post - registration route
app.post("/urls/register", (req, res) => {
  const {email, password} = req.body;
  let thisuser = getUser(email);
  // console.log(emailcheck);
// if statement to validate contents of the registration form
  if (email === "" || password === "") {
    res.sendStatus(400);
  } else if (thisuser) {
    res.sendStatus(400);
  } else {
    let id = generateRandomString();
    users[id] = {
      id: id,
      email: email,
      password: password
    };
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
});


// App listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});