// dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

// Global const for the app
const PORT = process.env.PORT || 8080; // default port 8080


// Databse 
const urlDatabase = {
    "b2xVn2": "http://lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
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

// App routes 
// Get - home route
app.get("/urls", (req, res) => {
    let templateVars = {
        username: req.cookies.username,
        urls: urlDatabase
    };
    res.render("urls_index", templateVars);
});

// Get - new URL route - /url_new
app.get("/urls/new", (req, res) => {
    let templateVars = {
        username: req.cookies.username,
        urls: urlDatabase
    };
    res.render("urls_new", templateVars);
    // res.redirect("/urls");
});

// Get - Show individual URL route - /url_show
app.get("/urls/:id", (req, res) => {
    let templateVars = {
        username: req.cookies.username,
        shortURL: req.params.id,
        longURL: urlDatabase[req.params.id]
    };
    res.render("urls_show", templateVars);
});

// Post - delete url route
app.post("/urls/:id/delete", (req, res) => {
    let templateVars = {
        username: req.cookies.username,
        urls: urlDatabase
    };
    console.log(urlDatabase[req.params.id]);
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

// this will update the value entered in text box
app.post("/urls/shortURL", (req, res) => {
    urlDatabase[req.body.shortURL] = req.body.longURL;
    // res.send("ok");
    res.redirect("/urls");
});

// Login route ===> user username coockie
app.post("/urls/login", (req, res) => {
    // console.log(req);
    res.cookie("username", req.body.username);
    res.redirect(req.headers.referer); // stay on same page
});
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});