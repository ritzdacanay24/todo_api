const { Recipe, validateRecipe } = require('../models/recipe');
const { User } = require('../models/user');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { auth } = require('../middleware/auth');

// create recipe
// return new data with id
router.post('/', auth, async (req, res) => {
    try {

        const { error } = validateRecipe(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const isUserFound = await User.findById(req.body.userId);
        if (!isUserFound) return res.status(400).send(`User "${req.body.userId}" not found in the system`)

        let recipe = new Recipe(req.body);

        await recipe.save();
        return res.send(recipe);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// get recipes by userId
// return array
router.get('/:userId', auth, async (req, res) => {
    try {

        const isUserFound = await User.findById(req.params.userId);
        if (!isUserFound) return res.status(400).send(`User "${req.params.userId}" not found in the system`)

        const recipes = await Recipe.find({ "userId": req.params.userId });

        return res.send(recipes);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// get recipe by id
// return object
router.get('/:recipeId/recipeId', auth, async (req, res) => {
    try {

        const recipe = await Recipe.findOne({ _id: req.params.recipeId });

        return res.send(recipe);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// delete recipe
// return success message object?
router.delete('/:recipeId', auth, async (req, res) => {
    try {
        let recipeId = req.params.recipeId;

        if (!mongoose.Types.ObjectId.isValid(recipeId)) return res.status(400).send("Invalid object id");

        const isFound = await Recipe.findById(recipeId);
        if (!isFound) return res.status(400).send(`Recipe id with "${recipeId}" not found in the system`)

        Recipe.findOneAndRemove(recipeId, function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send({message:"Recipe deleted"});
        });

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router