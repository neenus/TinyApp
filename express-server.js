const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
var PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

// function to generate a six charecter random string 
// this code snippet was copied from stackoverflow 
function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
// console.log(generateRandomString());


var urlDatabase = {
    "b2xVn2": "http://lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};


// routes 
// =========================================
app.get("/urls", (req, res) => {
    let templateVars = {
        urls: urlDatabase
    };
    res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
    // res.redirect("/urls");
});

app.get("/urls/:id", (req, res) => {
    let templateVars = {
        shortURL: req.params.id,
        longURL: urlDatabase[req.params.id]  
    };
    // console.log(shortURL);
    res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
    console.log(urlDatabase[req.params.id]);
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
});
// ===========================================


app.get('/', (req, res) => {
    res.end('Hello!');
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);

});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
    res.end("<html><body>Hello <b>World</b></body></html>\n");
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post("/urls", (req, res) => {
    // console.log(req.body); // debug statement to see POST parameters
        let newid =  generateRandomString();
        urlDatabase[newid] = req.body.longURL;
    // };
    // req.body.shortURL
    // req.body.longURL
    // res.send("Ok"); // Respond with 'Ok' (we will replace this)
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