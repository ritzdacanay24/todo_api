const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 5 },
    createdDate: { type: String, default: Date },
    isAdmin: { type: Boolean, default: false },
    avitar: { type: String, default: 'path/to/avitar' }
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin }, config.get('jwtSecret'));
};

const User = mongoose.model('user', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required().min(5),
        createdDate: Joi.date(),
        isAdmin: Joi.boolean(),
        avitar: Joi.string()
    });
    return schema.validate(user);
}

//things to check when updating
function validateUpdateUser(user){
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        isAdmin: Joi.boolean(),
        avitar: Joi.string()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateUpdateUser = validateUpdateUser;