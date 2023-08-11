const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phoneNumber: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: (value) => {
					return /(^(\+8801|8801|01|008801))[1|3-9]{1}(\d){8}$/.test(value);
				},
				message: "Invalid Bangladeshi Mobile Number!",
			},
		},
		password: { type: String, required: true, minlength: 5, maxlength: 21 },
		photo: { type: String },
		createdDate: { type: String, default: Date.now() },
	},
	{ versionKey: false }
);

const userModel = mongoose.model("userProfiles", UserSchema);

module.exports = userModel;
