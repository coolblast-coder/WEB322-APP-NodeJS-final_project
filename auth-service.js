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
