const mongoose = require('mongoose');
const Schema = mongoose.Schema;

UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    fullName:{
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobileNumber:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    } //more will be added later on
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;