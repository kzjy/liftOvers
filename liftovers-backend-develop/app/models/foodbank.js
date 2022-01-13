var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

var FoodBankSchema = mongoose.Schema({

    agency: {
        type: String,
        required: true
    },

    accepts: {
        type: Boolean
    },

    type: {
        type: String
    },

    address: {
        type: String,
        required: true
    },

    community: {
        type: String
    },

    phone: {
        type: String
    },

    hours: {
        type: String
    },

    limitations: {
        type: String
    },

    contact: {
        type: String
    },

    email: {
        type: String
    }
});

FoodBankSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('FoodBank', FoodBankSchema);