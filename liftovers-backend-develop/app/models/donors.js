var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

var DonorSchema = mongoose.Schema({

	email: {
		type: String,
		required: true
	},

	firstName: {
		type: String,
		required: true,
	},

	lastName: {
		type: String,
		required: true,
	},

	phone: {
		type: String,
		require: true,
	},

	address: {
		type: String,
		required: true,
	},

	contactPreference: {
        type: String,
        required: true
	},
	
	recurring: {
		type: Boolean,
	},

	notes: {
		type: String
	},

	lastSubmittedRequest : {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Donor'
	}

},
	{
	timestamps: true
	}
);

DonorSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Donor", DonorSchema);