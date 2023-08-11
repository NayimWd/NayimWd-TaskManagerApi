const mongoose = require('mongoose');
const TaskSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String},
    email: {type: String},
    createdDate: {type: Date, default: Date.now()}
}, {versionKey: false});

const TaskModel = mongoose.model('Tasks', TaskSchema);

module.exports = TaskModel;