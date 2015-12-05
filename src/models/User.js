import bcrypt from 'bcrypt-nodejs'
import mongoose from 'mongoose'

var User1 = mongoose.Schema({
    updated_at: String,
    local: {
        username: {
            type: String,
            unique: true
        },
        password: String,
        email: String,
        socketid: String
    },
    facebook: {
        id: String,
        username: String,
        token: String,
        email: String
    }

});




User1.methods.generateHash = function generateHash(password, callback) {
    bcrypt.genSalt(8, function(err, salt) {
        bcrypt.hash(password, salt, null, function saveHashedPassword(err, hash) {
            if (err) throw err;
            callback(hash);
        });
    });
};

User1.methods.checkPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, response) {
        if (err) {
            return cb(err);
        }
        cb(null, response);
    });
};
User1.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// checking if password is valid
User1.methods.validPassword = password => {
    return bcrypt.compareSync(password, this.local.password);
};

// module.exports = mongoose.model('User1', User1);




var User2 = mongoose.Schema({
    name: String,
    password: String,
    admin: Boolean,
    updated_at: Date
});



// User2.pre('save', next => {
//     const currentDate = new Date();
//     User2.updated_at = currentDate;
//     if (!User2.updated_at)
//         User2.updated_at = currentDate;
//     next();
// })



module.exports = mongoose.model('User2', User2);



// export var myVar1 = ...;
// export let myVar2 = ...;
// export const MY_CONST = ...;

// export function myFunc() {
//     ...
// }
// export function* myGeneratorFunc() {
//     ...
// }
// export class MyClass {
//     ...
// }