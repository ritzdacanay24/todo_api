const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    createdDate: { type: String, default: Date }
});

const Support = mongoose.model('support', supportSchema);

exports.Support = Support;