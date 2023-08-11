const TaskModel = require("../models/TasksModel");

// Create Task
exports.CreateTask = (req, res) => {
	let reqBody = req.body;

	reqBody.email = req.headers["email"];

	TaskModel.create(reqBody)
		.then((result) => {
			res.status(201).json({ status: "Task Created Success!", data: result });
		})
		.catch((err) => {
			res.status(400).json({ status: "Task Created Failed!", data: err });
		});
};

// Read Tasks
exports.ReadTasks = (req, res) => {
	TaskModel.find()
		.then((result) => {
			res.status(200).json({ status: "Task Find Success!", data: result });
		})
		.catch((err) => {
			res.status(400).json({ status: "Task Found Failed!", data: err });
		});
};

// Delete Task
exports.DeleteTask = (req, res) => {
	let id = req.params.id;
	let Query = { _id: id };

	TaskModel.deleteOne(Query)
		.then((result) => {
			res
				.status(200)
				.json({ status: "Task Deleted Successfully!", data: result });
		})
		.catch((err) => {
			res.status(400).json({ status: "Task Deleted Failed!", data: err });
		});
};

// Task Status Update
exports.UpdateStatus = (req, res) => {
	let id = req.params.id;
	const Query = { _id: id };
	const status = req.params.status;
	const reqBody = { status: status };

	TaskModel.updateOne(Query, reqBody)
		.then((result) => {
			res.status(200).json({ status: "Status Update Success!", data: result });
		})
		.catch((err) => {
			res.status(400).json({ status: "Status Update Failed!", data: err });
		});
};

// Task Select By Status
exports.SelectTasksByStatus = (req, res) => {
	let status = req.params.status;
	let email = req.headers.email;

	TaskModel.aggregate([
		{ $match: { status: status, email: email } },
		{
			$project: {
				_id: 1,
				title: 1,
				description: 1,
				status: 1,
				createdDate: {
					$dateToString: {
						date: "$createdDate",
						format: "%d-%m-%Y",
					},
				},
			},
		},
	])
		.then((result) => {
			res.status(200).json({ status: "Status Filter Success!", data: result });
		})
		.catch((err) => {
			res.status(400).json({ status: "Status Filter Failed", data: err });
		});
};

// task count
exports.TaskStatusCount = (req, res) => {
	let email = req.headers.email;
	TaskModel.aggregate([
		{ $match: { email: email } },
		{ $group: { _id: "$status", sum: { $count: {} } } },
	])
		.then((result) => {
			res.status(200).json({ status: "Task Count Success!", data: result });
		})
		.catch((err) => {
			res.status(400).json({ status: "Task Count Failed!", data: err });
		});
};
