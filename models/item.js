const mongoose = require('mongoose');
const Joi = require('joi');

const itemSchema = new mongoose.Schema({
    groupId: { type: String, required: false },
    recipeId: { type: String, required: false },
    image: { type: String, default: "path/to/icon" },
    name: { type: String, required: true },
    original: { type: String, required: true },
    qty: { type: Number, required: true },
    unitOfMeasure: { type: String, required: false },
    icon: { type: String, default: "path/to/iocn" },
    notes: { type: String, default: "" },
    createdDate: { type: String, default: Date },
    seq: { type: Number, default: 0 },
    completedDate: { type: String, default: null },
    listId: { type: String, required: true },
    createdBy: { type: String, required: true },
    price: { type: Number, required: false },
    aisle: { type: String, required: false },
    amount: { type: Number, required: false },
    ingredientId: { type: Number, required: false },
    recipeId: { type: Number, required: false },
    recipeName: { type: String, required: false },
});

const Item = mongoose.model('item', itemSchema);

function validateItem(item) {
    const schema = Joi.object({
        groupId: Joi.string().allow(''),
        recipeId: Joi.string().allow(''),
        image: Joi.string().allow(''),
        name: Joi.string().required(),
        original: Joi.string().required(),
        qty: Joi.number().required(),
        unitOfMeasure: Joi.string().allow(''),
        icon: Joi.string(),
        notes: Joi.string().allow(''),
        createdDate: Joi.string(),
        seq: Joi.number(),
        completedDate: Joi.string().allow(null, ''),
        listId: Joi.string().required(),
        createdBy: Joi.string().required(),
        price: Joi.number().precision(2),
        aisle: Joi.string().allow(''),
        amount: Joi.number(),
        ingredientId: Joi.number(),
        recipeId: Joi.number(),
        recipeName: Joi.string(),
    });
    return schema.validate(item);
}

exports.Item = Item;
exports.validateItem = validateItem;