var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

var VolunteerSchema = mongoose.Schema({
  email: {
      type: String,
      required: true
  },
  password: {
      type: String,
      required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    require: true,
  },
  postalCode: {
    type: String,
    required: false
  }, 

  availability: [{
    dayOfWeek: Number,
    timeStart: {
      hour: Number,
      minute: Number,
    },
    timeEnd: {
      hour: Number,
      minute: Number
    }
  }],

  lastReceivedRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lift'
  },

  lastAcceptedRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lift'
  },

  role: {
    type: String,
    default: "volunteer"
  }
},
  {
    timestamps: true
  }
);

VolunteerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Volunteer", VolunteerSchema);
