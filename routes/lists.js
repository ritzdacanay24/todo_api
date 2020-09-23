const { Item } = require('../models/item');
const { List, validateList } = require('../models/list');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');
const email = require('./sendEmail');
const config = require('config');

//Invite User to list
router.post('/listInvite', async (req, res) => {
    try {

        let to = req.body.toEmail;
        let from = req.body.fromEmail;

        let subscribeLink = `${config.mainAppUrl}/InviteRequests?listId=${req.body.listId}&toUser=${req.body.toId}`
        let mailOptions = {
            from: from,
            to: to,
            subject: 'Grocery ToDo Invite',
            html: `
                <div>
                    <p>Hello ${to}, </p> <br>

                    <p>${from} has sent you an invite to his/her grocery todo app.<p>
                    <p>Please accept this invitation.<p>
                    <a href="${subscribeLink}"><button>Subscribe</button></a>
                    <h4>THIS IS ONLY A TEST</h4>
                </div>
            `
        }

        email.sendEmail(mailOptions);
    }
    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
})

// create list
// return new data with id
router.post('/', auth, async (req, res) => {

    const { error } = validateList(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {

        if (!mongoose.Types.ObjectId.isValid(req.body.userId)) return res.status(400).send("Invalid object id");

        const isUserFound = await User.findById(req.body.userId);
        if (!isUserFound) return res.status(400).send(`User "${req.body.userId}" not found in the system`)

        let list = new List({
            userId: req.body.userId,
            createdDate: req.body.createdDate,
            icon: req.body.icon,
            color: req.body.color,
            seq: req.body.seq,
            name: req.body.name,
            link: req.body.link,
        });

        await list.save();
        return res.send(list);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// update list by id
// returns new data
router.put('/:listId', auth, async (req, res) => {

    // const { error } = validateListUpdate(req.body);
    // if (error) return res.status(400).send(error);

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.listId)) return res.status(400).send("Invalid object id");

        const isFound = await List.findById(req.params.listId);
        if (!isFound) return res.status(400).send(`List id with "${req.params.listId}" not found in the system`)

        List.findOneAndUpdate({ _id: req.params.listId }, { $set: req.body }, { upsert: true, new: true }, function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send(doc);
        });

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// delete list by id
router.delete('/:listId', auth, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.listId)) return res.status(400).send("Invalid object id");

        const isFound = await List.findById(req.params.listId);
        if (!isFound) return res.status(400).send(`List id with "${req.params.listId}" not found in the system`)

        List.findOneAndRemove({ _id: req.params.listId }, function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send(doc);
        });

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//get lists by current user id and subscribers
//returns all data based on user id
router.get('/:currentUserid', auth, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.currentUserid)) return res.status(400).send("Invalid object id");

        //let lists = await List.find({ "userId": req.params.currentUserid, "active": { "$ne": "0" } });
        //Query is now updated to include subscribers
        let lists = await List.find({ $or: [{ 'userId': req.params.currentUserid }, { 'subscribers': { $in: [req.params.currentUserid] } }] });
        let listDetails = await Item.find({ createdBy: req.params.currentUserid });

        //get total list details for each list.
        lists.map((list) => {
            let id = list._id;
            list.detailCount = 0;
            listDetails.map((detail) => {
                if (id == detail.listId) {
                    if (detail.completedDate == null)
                        list.detailCount++
                }
            })
        })

        return res.send(lists);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//Add subscriber to list
router.put('/subscribers/:listId/:currentUserid', async (req, res) => {
    try {

        let list = await List.findOne({ "_id": req.params.listId });
        let isFound = list.subscribers.includes(req.params.currentUserid);
        if (isFound) return res.status(400).send("User already subscribed");
        list.subscribers.push(req.params.currentUserid);

        list.save();
        return res.send({ message: `Thank you for subscribing to list ${list.name}` });

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//delete subscriber from list
router.delete('/subscribers/:listId/:currentUserid', async (req, res) => {
    try {

        let list = await List.findOne({ "_id": req.params.listId });
        let isFound = list.subscribers.includes(req.params.currentUserid);
        if (!isFound) res.status(400).send("User not found in subscribed list.");

        for (let i = 0; i < list.subscribers.length; i++)
            if (list.subscribers[i] === req.params.currentUserid) {
                list.subscribers.splice(i, 1);
                break;
            }

        list.save();
        return res.send(list);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router
