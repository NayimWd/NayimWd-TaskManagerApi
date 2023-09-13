const nodemailer = require("nodemailer");

let password = process.env.G_PASS;
const SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
	const transporter = nodemailer.createTransport({
		// service: "gmail",
		host: "mail.teamrabbil.com",
		port: 25,
		secure: false,
		auth: {
			user: "info@teamrabbil.com",
			pass: "~sR4[bhaC[Qs",
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	let mailOptions = {
		from: "বৃক্ষবান <info@teamrabbil.com>",
		to: EmailTo,
		subject: EmailSubject,
		text: EmailText,
	};

	return await transporter.sendMail(mailOptions);
};

module.exports = SendEmailUtility;

// info@teamrabbil.com
// mail.teamrabbil.com