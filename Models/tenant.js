const mongoose = require('mongoose');
const Schema = mongoose.Schema;

TenantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password:{
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

const TenantModel = mongoose.model('Tenant', TenantSchema);

module.exports = TenantModel;