// dependencies
const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt'); 

// Global const for the app
const PORT = process.env.PORT || 8080; // default port 8080


// URLs Databse - new structure
const urlDatabase = {
  "b2xVn2": {
    userId: "userRandomID",
    longURL: "http://lighthouselabs.ca"
  }, 

  "9sm5xK": {
    userId: "userRandomID2",
    longURL: "http://www.google.com"
  }
};

// Users Database
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("asdf", 10)
  },
 "userRandomID2": {
    id: "userRandomID2", 
    email: "email@email.com", 
    password: bcrypt.hashSync("asdf", 10)
  }
};

// Setup express app
const app = express();

// Setup middleware
app.use(cookieSession({
  keys: ["hashedCookie"]
}));
app.use(bodyParser.urlencoded({
  extended: true
}));

// view enginge
app.set('view engine', 'ejs');

// ===========================================================================
// ========================= Helper functions ================================
// ===========================================================================

// function to generate a six charecter random string 
// disclosure: this code snippet was copied from a post on stackoverflow 
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

function urlsForUser(id) {
  let thisUserUrls = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userId === id) {
      thisUserUrls[url] = urlDatabase[url];
    }
  }
  return thisUserUrls;
}

// ===========================================================================
// ============================ App Routes ===================================
// ===========================================================================

// Get - home route
app.get("/urls", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id], //user: users[req.cookies.id]
    urls: urlsForUser(req.session.user_id)
  };

  res.render("urls_index", templateVars);
});


// Get - new URL route - /url_new
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id], 
    urls: urlDatabase
  };
  if (req.session.user_id) {
    res.render("urls_new", templateVars);

  } else {
    res.redirect("/login");
  }

});

// Get - register route ===> registration form /register
app.get("/register", (req, res) => {
  let templateVars = {
    user : undefined,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  if (!req.session.user_id) {
    res.render("urls_register", templateVars);
  } else {
    res.redirect("/urls");
  }
});

// Get - Login route - /urls_login
app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  
  if (!req.session.user_id) {
    res.render("urls_login", templateVars);
  } else {
    res.redirect("/urls");
  }
});

// Post - registration route
app.post("/register", (req, res) => {
  const {email, password} = req.body;
  let thisuser = getUser(email);
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
      password: bcrypt.hashSync(password, 10)
    };
    req.session.user_id = id;
    res.redirect("/urls");
  }
});

// Get - Show individual URL route - /url_show
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    shortURL: req.params.id,
    url: urlDatabase[req.params.id]
  };

  if(req.session.user_id === urlDatabase[req.params.id].userId) {
    res.render("urls_show", templateVars);
  } else {
    res.send("Apologies... Seems like you are not the owner of this link ....");
  }
  
});

// Get - Redirect short URLs
app.get("/u/:shortURL", (req, res) => {
  let url = urlDatabase[req.params.shortURL];
  let longURL = url.longURL;
  res.redirect(longURL);
});

// Post - delete url route
app.post("/urls/:id/delete", (req, res) => {
  let currentUserID = req.session.user_id;
  let url = urlDatabase[req.params.id];
  if (currentUserID === url.userId) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    res.sendStatus('403');
  }

});

// Post - Home route to add new url - '/urls/ 
app.post("/urls/new", (req, res) => {
  let newid = generateRandomString();
  urlDatabase[newid] = {longURL:req.body.longURL, userId:req.session.user_id };
  res.redirect(`/urls/${newid}`);

});

// Post - update this will update the value entered in text box
app.post("/urls/:id", (req, res) => {
  let currentUserID = req.session.user_id;
  let url = urlDatabase[req.params.id];
  if (currentUserID === url.userId) {
    urlDatabase[req.params.id] = {longURL:req.body.longURL, userId:currentUserID};
    res.redirect("/urls");
  } else {
    res.sendStatus('403');
  } 
});

// Post - Login route ===> user username cookie
app.post("/login", (req, res) => {
  const {email, password} = req.body;
  let thisuser = getUser(email);

  if (!thisuser) {
    res.sendStatus(403);
  } else if (bcrypt.compareSync(password, thisuser.password)) {
    req.session.user_id = thisuser.id;
    res.redirect("/urls");
  } else {
    res.send("Sorry your username and password did not match our records");
  }
});

// Post - Logout route ===> clear username cookie
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});
// =============================================================

// App listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});