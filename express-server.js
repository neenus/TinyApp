const express = require('express');
const app = express();
var PORT = 8080; // default port 8080

app.set('view engine', 'ejs');


var urlDatabase = {
    "b2xVn2": "http://lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};


// views 
// =========================================
app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase};
    res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
    let templateVars = { 
        shortURL: req.params.id,
        longURL: urlDatabase[req.params.id]
    };
    res.render("urls_show", templateVars);
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
