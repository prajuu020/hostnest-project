const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type:String,
        required:true,
        unique:true
    }
});
userSchema.plugin(passportLocalMongoose);
// we use plugin to automatically access the username ,hashing , salting and hash password and implement.

 module.exports = mongoose.model("User",userSchema);