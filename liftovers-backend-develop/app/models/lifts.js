var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")

var LiftSchema = mongoose.Schema({

    donor: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Donor'
    },

    availability: {
        date: {
            year: Number,
            month: Number,
            day: Number
        },
        time: {
            hour: Number,
            minute: Number,
        }
    },
    
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodBank'
    },

    description: {
        type: String,
        required: true
    },

    hasVolunteer: {
        type: Boolean, 
        default: false 
    },

    volunteer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Volunteer'
    },

    status: {
        type: String,
        default: "Incomplete"
    },  

    // Cancellation reason
    reason: {
        type: String
    }

}, {
    timestamps: true
});

LiftSchema.plugin(mongoosePaginate)
LiftSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('Lift', LiftSchema);