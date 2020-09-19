const mongoose = require('mongoose');
const Joi = require('joi');

let groupList = [
    {
        "name": "Dairy",
        "seq": 0,
        "icon": ""
    }, +
    {
        "name": "Meats",
        "seq": 1,
        "icon": ""
    },
    {
        "name": "Breakfat & Cereal",
        "seq": 2,
        "icon": ""
    },
    {
        "name": "Condiments & Dressings",
        "seq": 3,
        "icon": ""
    },
    {
        "name": "Cooking & Baking",
        "seq": 4,
        "icon": ""
    },
    {
        "name": "Baking",
        "seq": 5,
        "icon": ""
    },
    {
        "name": "Beverages",
        "seq": 6,
        "icon": ""
    },
    {
        "name": "Deli",
        "seq": 7,
        "icon": ""
    },
    {
        "name": "Frozen Foods",
        "seq": 8,
        "icon": ""
    },
    {
        "name": "Grain, Pasta & Sides",
        "seq": 9,
        "icon": ""
    },
    {
        "name": "Produce",
        "seq": 10,
        "icon": ""
    }
]

const groupSchema = new mongoose.Schema({
    name: { type: String, required: false },
    seq: { type: Number, default: 0, required: false },
    icon: { type: String, default: "path/to/icon", required: false }
});

const listSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    createdDate: { type: String, required: true, default: Date },
    icon: { type: String, default: "fa fa-th-list" },
    color: { type: String, default: "orange", enum: ["orange", "blue", "red"] },
    seq: { type: Number, default: 0 },
    name: { type: String, required: true },
    link: { type: String, required: true },
    detailCount: { type: Number, default: 0 },
    archive: { type: Boolean, default: false, enum: [false, true] },
    groups: { type: [groupSchema], default: groupList }
});

const List = mongoose.model('list', listSchema);

function validateList(user) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        createdDate: Joi.date(),
        icon: Joi.string(),
        color: Joi.string(),
        seq: Joi.number(),
        name: Joi.string().required(),
        link: Joi.string().required(),
        archive: Joi.boolean().valid(false, true)
    });
    return schema.validate(user);
}

function validateListUpdate(user) {
    const schema = Joi.object({
        seq: Joi.number(),
        name: Joi.string().required(),
        link: Joi.string().required(),
        icon: Joi.string(),
        color: Joi.string()
    });
    return schema.validate(user);
}

function validateGroup(group) {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    return schema.validateGroup(group);
}

exports.List = List;
exports.validateList = validateList;
exports.validateListUpdate = validateListUpdate;
exports.validateGroup = validateGroup;
