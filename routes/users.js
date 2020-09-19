const { User, validateUser, validateUpdateUser } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

//create user
router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User already registered")

        const salt = await bcrypt.genSalt(10);

        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        })

        await user.save();
        return res.send(user);
    }

    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})

//update user
router.put('/:userId', async (req, res) => {
    try {

        let userId = req.params.userId;

        const { error } = validateUpdateUser(req.body);
        if (error) return res.status(400).send(error);

        let user = await User.findOne({ _id: userId });
        if (!user) return res.status(400).send("User not found.")

        User.findOneAndUpdate({ _id: userId }, { $set: req.body }, { upsert: true, new: true }, function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send(doc);
        });
    }

    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})

//Get all Users
//Returns an array
router.get('/', async (req, res) => {
    try {
        let user = await User.find();
        return res.send(user);
    }

    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})

//Get all Users
//Returns an object
router.get('/:userId', async (req, res) => {
    try {
        let userId = req.params.userId;
        let user = await User.findOne({_id:userId});
        if (!user) return res.status(400).send("User not found");
        return res.send(user);
    }

    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})

module.exports = router
