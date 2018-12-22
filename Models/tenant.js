const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TenantSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

const Tenant = mongoose.model('tenant', TenantSchema);

module.exports = Tenant;