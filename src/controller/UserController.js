const OTPModel = require("../models/OTPmodel");
const userModel = require("../models/UsersModel");
const jwt = require("jsonwebtoken");
const SendEmailUtility = require("../utility/SendEmailUtility");
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
// get user profile details
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

// =================================  //
// recover email
// ================================= //
exports.RecoverEmail = async (req, res) => {
	// find email
	let email = req.params.email;
	
	let OTPCode = Math.floor(100000 + Math.random() * 900000);

	try {
		// email query 
		let UserCount = await userModel.aggregate([
			{$match: {email: email}}, {$count: "total"}
		]);
	
		if(UserCount.length != 0){
			// insert otp
			let CreateOtp = await OTPModel.create({email: email, otp: OTPCode})
			
			let SendEmail = await SendEmailUtility(email, `Your OTP Code is: ${OTPCode}`, "বৃক্ষবান OTP Verification");
			
			// send email
			res.status(200).json({status: "Email send Success!", data: SendEmail})

		} else {
			res.status(200).json({status: "user error!", data: "No user found"})
		}
		
	} catch (err) {
		res.status(200).json({status: "email recover failed", data: err})
	}
}


// ==================================  //
// Verify OTP
// ================================== //

exports.VerifyOTP = async (req, res) => {
	let email = req.params.email;
	let OTPCode = req.params.otp;

	let status = 0;
	let statusUPdate = 1;

	// Query otp, match email & otp code result 0
	// if result 0, then update this code 
	try {
	let OTPCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPCode, status: status}}, {$count: "total"}])

	if(OTPCount.length > 0){
		let OTPUpdate = await OTPModel.updateOne({email: email, otp: OTPCode}, {email: email, otp: OTPCode, status: statusUPdate});
		res.status(200).json({status: "OTP update success!", data: OTPUpdate})
	} else{
		res.status(200).json({status: "OTP Expired!", data: "Invalid OTP code!"})
	}

	} catch (error) {
		res.status(200).json({status: "OTP Failed!", data: error})
	}

	
}

// ================================  //
// rest password
// ================================ //
exports.ResetPassword  = async (req, res) => {
	let email = req.body.email;
	let otpCode = req.body.otp;
	let newPass = req.body.password;

	let statusUPdate = 1;

	try {
		let OTPUsedCount = await await OTPModel.aggregate([{$match: {email: email, otp: otpCode, status: statusUPdate}}, {$count: "total"}]);

		
		if(OTPUsedCount.length > 0){
			let UpdatePass = await userModel.updateOne({email: email}, {
				password: newPass
			});
			res.status(200).json({status: "reset password success!", data: UpdatePass})

		} 
		else{
			res.status(200).json({status: "otp error", data: "invalid Otp code"})
		}

	} catch (error) {
		res.status(200).json({status: "Password Update Failed", data: error})
	}
}