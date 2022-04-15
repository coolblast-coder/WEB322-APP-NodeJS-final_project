var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    "userName": {type: String, unique: true},
    "password": String,
    "email": String,
    "loginHistory": [{"dateTime":Date, "userAgent":String}]
});

let User; // to be defined on new connection (see initialize)

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://alyapunov:v6TbRXiHhHXzUUvu@senecaweb.1wzid.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};


module.exports.registerUser = function(userData) {
    return new Promise((resolve, reject)=>{
        if(userData.password != userData.password2){
            reject("Passwords do not match");
        }
        else{
            let newUser = new User(userData);
            console.log(newUser);
            newUser.save((err)=>{
                if (err){
                    if(err.code == 11000)
                    reject("User Name already taken")
                    else
                    reject("There was an error creating the user: err" + err);
                }
                else
                resolve();
            });
        }
    })
}

module.exports.checkUser = function(userData){
    return new Promise((resolve, request) =>{
        User.find({userName: userData.userName}).exec().then((users)=>{
            if(!users){
                reject("Unable to find user: " + userData.userName);
            }
           if(userData.password == users[0].loginHistory){
               console.log(users[0].loginHistory);
               users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
               console.log(users[0].loginHistory);

               User.update(
                   {userName: users[0].userName},
                   {$set: {loginHistory:users[0].loginHistory}}
               ).exec().then(()=>{
                   resolve(users[0]);
               }).catch((err)=>{
                   reject("There was an error verifying the user: err" + err);
               });
           }
           else{
               console.log("Incorrect password for user: " + userData.userName);
           }
        }).catch((err)=>{
            reject("Unable to find user: " + userData.userName)
        })
    })
}