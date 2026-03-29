 require("dotenv").config({path:"./.env"});

const chatRoute = require("./routes/chat");
const express = require("express");
const OpenAI = require("openai");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/ExpressError");
const session = require("express-session");
//const MongoStore = require("connect-mongo");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main() 
{
    await mongoose.connect(dbUrl);
};

const sessionOptions = {
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    },
};


app.use(session(sessionOptions));
app.use(express.json());
app.use(require("connect-flash")()); 
// before using passport.session() we need to initialize the session 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
// serialize means to store in the session and deserialize means to get it out of the session used by passport.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//Passport configuration
//we r using pbkdf2 hashing algorithm to hash the password and we are using salting to add some random string to the password before hashing it to make it more secure and we are using passport-local-mongoose plugin to implement all these features in our user model and we are using passport-local strategy for authentication.
app.get("/demouser",async (req,res)=>{
    const fakeUser = new User({
        email:"demouser@gmail.com",
        username:"demouser"
    });
   let registeredUser = await User.register(fakeUser,"demopassword");
   res.send(registeredUser);
});

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");





app.set("views engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);
app.use("/",chatRoute);

app.get("/", (req, res) => {
    res.send("App is working 🚀");
});
//standard Request and * means all incoming request
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs",{message});
  //res.status(statusCode).send(message);
});

app.listen(8080, () =>{
    console.log("server is listening to port 8080");
});