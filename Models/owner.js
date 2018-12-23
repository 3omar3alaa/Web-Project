const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// To make the schema nested for places per owner https://stackoverflow.com/questions/39596625/nested-objects-in-mongoose-schemas 
// To hash the password use this link: https://stackoverflow.com/questions/14588032/mongoose-password-hashing
// To add images use this link: https://medium.freecodecamp.org/how-to-allow-users-to-upload-images-with-node-express-mongoose-and-cloudinary-84cefbdff1d9 
const OwnerSchema = new Schema({
    name: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        // required: true
    },
    places : [{
        address: String,
        size: Number,
        available_time_interval: 
        {
            from: Date,
            to: Date
        },
        notes: String,
        price: Number
    }],

});

const Owner = mongoose.model('owner', OwnerSchema);

module.exports = Owner;