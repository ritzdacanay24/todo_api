
const express = require('express');
const router = express.Router();
const Axios = require('axios');
const config = require('config');
const { auth } = require('../middleware/auth');

const rapidApiKey = config.spoonacular.key;

router.post('/extractRecipeFromUrl', auth, async (req, res) => {
    try {
        
        let results = await Axios({
            "method": "GET",
            "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract",
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key": rapidApiKey,
                "useQueryString": true
            }, "params": {
                "url": req.body.url
            }
        })

        let data = results.data;
        results.data = {
            title: data.title,
            summary: data.summary,
            ingredients: data.extendedIngredients,
            steps: data.analyzedInstructions.length > 0 ? data.analyzedInstructions[0].steps : [],
            rating: 0,
            notes: "",
            source: data.sourceName,
            servings: data.servings,
            prepTime: data.preparationMinutes,
            cookTime: data.cookingMinutes,
            readyInMinutes: data.readyInMinutes,
            veryPopular: data.veryPopular,
            image: data.image,
            pricePerServing: data.pricePerServing,
            instructions: data.instructions,
            recipe: results.data,
            id: results.data.id
        }

        return res.send(results.data);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/searchRecipe/:total/total/:offset/startFrom/:recipeName/recipe', auth, async (req, res) => {
    try {

        let results = await Axios({
            "method": "GET",
            "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search",
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key": rapidApiKey,
                "useQueryString": true
            }, "params": {
                "number": req.params.total,
                "offset": req.params.offset,
                "query": req.params.recipeName
            }
        })

        return res.send(results.data);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/searchRecipeById/:id', auth, async (req, res) => {
    try {

        let results = await Axios({
            "method": "GET",
            "url": `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${req.params.id}/information`,
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key": rapidApiKey,
                "useQueryString": true
            }
        })

        let data = results.data;
        results.data = {
            title: data.title,
            summary: data.summary,
            ingredients: data.extendedIngredients,
            steps: data.analyzedInstructions.length > 0 ? data.analyzedInstructions[0].steps : [],
            rating: 0,
            notes: "",
            source: data.sourceName,
            servings: data.servings,
            prepTime: data.preparationMinutes,
            cookTime: data.cookingMinutes,
            readyInMinutes: data.readyInMinutes,
            veryPopular: data.veryPopular,
            image: data.image,
            pricePerServing: data.pricePerServing,
            instructions: data.instructions,
            recipe: results.data,
            id: results.data.id
        }

        return res.send(results.data);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/informationBulk', auth, async (req, res) => {
    try {
        let results = await Axios({
            "method": "GET",
            "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk",
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key": rapidApiKey,
                "useQueryString": true
            }, "params": {
                "ids": req.query.ids
            }
        })
        return res.send(results.data);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/mealPlanGenerate', auth, async (req, res) => {
    try {
        let results = await Axios({
            "method": "GET",
            "url": "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/mealplans/generate",
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key": rapidApiKey,
                "useQueryString": true
            }, "params": {
                "timeFrame": "week"
            }
        })
        return res.send(results.data);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router