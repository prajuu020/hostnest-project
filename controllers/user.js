const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res)=>{
   try{
     const {email,username,password} = req.body;
    const newuser = new User({email,username});
    const registeredUser = await User.register(newuser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","Welcome to HostNest!");
    res.redirect("/listings");
   });
}catch(e){
     req.flash("error",e.message);
     res.redirect("/signup");
   }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
      //req.logout is a function provided by passport to log the user out. It takes a callback function that is called when the logout process is complete. If there is an error during logout, it will be passed as an argument to the callback function.
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
}