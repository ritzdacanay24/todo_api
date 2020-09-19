const mongoose = require('mongoose');
const Joi = require('joi');

const recipeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, default: "" },
    ingredients: { type: Array, default: [], required: true },
    steps: { type: Array, default: [] },
    rating: { type: Number, default: 0 },
    notes: { type: String },
    source: { type: String, required: false },
    servings: { type: Number, required: false },
    prepTime: { type: Number, required: false },
    cookTime: { type: Number, required: false },
    readyInMinutes: { type: Number, required: false },
    veryPopular: { type: Boolean, required: false },
    image: { type: String, required: false },
    pricePerServing: { type: Number, required: false },
    instructions: { type: String, required: false },
    nutrition: { type: Number, default: "" },
    icon: { type: String, required: true, default: 'path/to/icon' },
    recipe: { type: Object, default: [] },
    id: { type: Number }
});

const Recipe = mongoose.model('recipe', recipeSchema);

function validateRecipe(details) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        title: Joi.string().required(),
        summary: Joi.string().allow(""),
        ingredients: Joi.array().required(),
        steps: Joi.array(),
        rating: Joi.number(),
        notes: Joi.string().allow(""),
        source: Joi.string().allow("").allow(null),
        servings: Joi.number().allow(""),
        prepTime: Joi.number().allow(""),
        cookTime: Joi.number().allow(""),
        readyInMinutes: Joi.number().allow(""),
        veryPopular: Joi.boolean(),
        image: Joi.string(),
        pricePerServing: Joi.number().allow(""),
        instructions: Joi.string().allow(""),
        nutrition: Joi.string().allow(""),
        icon: Joi.string(),
        recipe: Joi.object().required(),
        id: Joi.number()
    });
    return schema.validate(details);
}

exports.Recipe = Recipe;
exports.validateRecipe = validateRecipe;