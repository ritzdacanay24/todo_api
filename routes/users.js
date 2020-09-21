const { User, validateUser, validateUpdateUser, validateLogin } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { auth } = require('../middleware/auth');

//create user
router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send({message:"User already registered"})

        const salt = await bcrypt.genSalt(10);

        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        })

        await user.save();
        return res.send({message:"Successfully registered"});
    }

    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})

//update user
router.put('/:userId', auth, async (req, res) => {
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
router.get('/', auth, async (req, res) => {
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
router.get('/:userId', auth, async (req, res) => {
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

//Login User
router.post('/login', async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error);

        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid email or password.');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.')

        const token = user.generateAuthToken();

        return res
            .header('x-auth-token', token)
            .header('access-control-expose-headers', 'x-auth-token')
            .send({ appToken: token, userId:user._id});
    }
    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

module.exports = router
