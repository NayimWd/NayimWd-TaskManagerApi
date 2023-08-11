const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	let Token = req.headers['token'];

	jwt.verify(Token, "token87s8d", (err, decoded) => {
		if (err) {
			res.status({ status: "Token Not Matched", data: err });
		} else {
			let email = decoded["data"];
			req.headers.email = email;
			next();
		}
	});
};
