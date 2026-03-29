const express = require('express');
const app = express();
const users = require('./classroom/user');
const posts = require('./classroom/post');
const session = require('express-session');
const flash = require('connect-flash'); 
const path = require('path'); 

app.set("views engine", "ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions = {
  secret: "mysupersecretstring", resave: false, saveUninitialized: true
};
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  req.flash("success", "You have successfully registered!");
  res.redirect("/hello");
});

app.get("/hello"  , (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

  // app.get("/reqcount", (req, res) => {
  //   if(res.session.count){  
  //     req.session.count++;
  //   } else{
  //     req.session.count=1;
  //   }
  // res.session.count=1;
  // res.send(`you have visited this page ${res.session.count} times`);  
  // });
  // app.get("/test", (req, res) => {
  //   res.send("Test successful");
  // });

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie", (req, res) => {
//   res.cookie("madeIn", "India", {signed: true});
//   res.send("signed cookie has been set");
// } );

// app.get("/verify", (req, res) => {
//   console.log(req.signedCookies);
//   res.send("Verified signed cookie");
// });

// app.get("/getcookies", (req, res) => {   
//   res.cookie("greet","namaste");
//   res.send("cookie has been set");
// });

// app.get("greet", (req, res) => {
//   let {name="anonymous"} = req.cookies;
//   res.send(`hello ${name}, welcome to cookies`);
// });

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("cookie has been read");
// });

// app.use('/users', users);
// app.use('/posts', posts);

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

