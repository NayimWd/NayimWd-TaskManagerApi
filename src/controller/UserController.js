const userModel = require("../models/UsersModel");
const jwt = require("jsonwebtoken");
// Registration
exports.Registration = (req, res) => {
	let reqbody = req.body;

	userModel
		.create(reqbody)
		.then((data) => {
			res.status(201).json({ status: "User Created Success!", data: data });
		})
		.catch((err) => {
			res.status(400).json({ status: "User Create Failed!", data: err });
		});
};

// profile login
exports.Login = (req, res) => {
	let reqBody = req.body;

	userModel
		.aggregate([
			{ $match: reqBody },
			{
				$project: {
					_id: 0,
					firstName: 1,
					lastName: 1,
					email: 1,
					phoneNumber: 1,
					photo: 1,
				},
			},
		])
		.then((data) => {
			if (data[0].length !== null) {
				let payload = {
					exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
					data: data[0]["email"],
				};
				
				let token = jwt.sign(payload, "token87s8d");

				res
					.status(200)
					.json({ status: "Login Success", token: token, data: data[0] });
			} else{
				res.status(401).json({status: "AnAuthorized User(lt)"})
			}
		})
		.catch((err) => {
			res
				.status(400)
				.json({ status: "UnAuthorized User", data: "Login Failed" });
		});
};

// profile update
exports.UpdateProfile = (req, res) => {
	const tokenEmail = req.headers.email;

	const { firstName, lastName, email, phoneNumber, password, photo } = req.body;

	const reqBody = req.body;

	const updateBody = {
		firstName,
		lastName,
		email,
		phoneNumber,
		password,
		photo,
	};

	userModel.updateOne({ email: tokenEmail }, { $set: updateBody }, { upsert: true })
	.then((result) => {
		res.status(200).json({ status: "Profile update Success", data: result });
	})
	.catch((err) => {
		res.status(401).json({ status: "profile update failed", data: err });
	});


};

exports.getProfileDetails = (req, res) => {
	let reqEmail = req.headers?.email;

	userModel.aggregate([
		{$match: {email: reqEmail}},
		{$project: {_id: 1, email: 1, firstName: 1, lastName: 1, phoneNumber: 1, photo: 1, password: 1 }}
	])
	.then((result)=>{
		res.status(200).json({status: "Profile details found success!", data: result})
	})
	.catch((err)=>{
		res.status(400).json({status: "Profile details not found!", data: err})
	})
}