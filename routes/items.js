const { Item, validateItem } = require('../models/item');
const { List } = require('../models/list');
const { User } = require('../models/user');
const { auth } = require('../middleware/auth');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// create list details
// return new data with id
router.post('/', auth, async (req, res) => {
    try {

        const { error } = validateItem(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const isUserFound = await User.findById(req.body.createdBy);
        if (!isUserFound) return res.status(400).send(`User "${req.body.createdBy}" not found in the system`)

        const isListFound = await List.findOne({ _id: req.body.listId });
        if (!isListFound) return res.status(400).send(`List id "${req.body.listId}" not found.`);

        let listDetail = new Item(req.body);

        await listDetail.save();
        return res.send(listDetail);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// update list detail by id
// returns new data
router.put('/:itemId', auth, async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) return res.status(400).send("Invalid object id");

        const isFound = await Item.findById(req.params.itemId);
        if (!isFound) return res.status(400).send(`Detail list id with "${req.params.itemId}" not found in the system`)

        Item.findOneAndUpdate({ _id: req.params.itemId }, { $set: req.body }, { upsert: true, new: true }, function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send(doc);
        });

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//delete list by id
// returns original data
router.delete('/:itemId', auth, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) return res.status(400).send("Invalid object id");

        const isFound = await Item.findById(req.params.itemId);
        if (!isFound) return res.status(400).send(`Detail list id with "${req.params.itemId}" not found in the system`)

        Item.findOneAndRemove({ _id: req.params.itemId }, function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send(doc);
        });

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//get details lists by list id
//returns all data based on id
router.get('/:listId', auth, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.listId)) return res.status(400).send("Invalid object id");

        const listDetails = await Item.find({ "listId": req.params.listId });
        const lists = await List.findOne({ _id: req.params.listId }).select({ "_id": 1, "name": 1 });

        return res.send({ lists: lists, details: listDetails });

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


//arrays

// create bulk items
// return newly added bulk items with its id's
router.post('/saveBulkItems/:currentUser/:listId', auth, async (req, res) => {
    try {

        const isUserFound = await User.findById(req.params.currentUser);
        if (!isUserFound) return res.status(400).send(`User "${req.params.currentUser}" not found in the system`)

        const isListFound = await List.findOne({ _id: req.params.listId });
        if (!isListFound) return res.status(400).send(`List id "${req.params.listId}" not found.`);

        let items = req.body;

        items.forEach(function (element) {
            element.listId = req.params.listId;
            element.createdBy = req.params.currentUser;
            element._id = mongoose.Types.ObjectId();
        });

        let newlist = await Item.insertMany(items,
            {
                writeConcern: true,
                ordered: true
            }
        )

        return res.send(newlist);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// delete bulk items
// return newly added bulk items with its id's
router.delete('/deleteBulkItems/:listId', auth, async (req, res) => {
    try {

        let newlist = await Item.deleteMany({ "listId": req.params.listId });

        return res.send(newlist);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// update bulk items
// return newly updated array
router.put('/updateBulkItems/:listId', auth, async (req, res) => {
    try {

        let updateItems = await Item.updateMany(
            { listId: { $eq: req.params.listId } },
            { $set: { "completedDate": req.body.completedDate } }
        );

        return res.send(updateItems);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// update bulk group items
// return newly updated array
router.put('/updateBulkGroupItems/:listId/:aisleName', auth, async (req, res) => {
    try {

        let updateItems = await Item.updateMany(
            { listId: { $eq: req.params.listId }, aisle: { $eq: req.params.aisleName } },
            { $set: { "completedDate": req.body.completedDate } }
        );

        return res.send(updateItems);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// move item
// return newly updated array
router.put('/moveItem/:itemId/:aisleName', auth, async (req, res) => {
    try {

        let updateItems = await Item.updateMany(
            { _id: { $eq: req.params.itemId } },
            { $set: { "aisle": req.params.aisleName } }
        );

        return res.send(updateItems);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// update and move bulk items
// return newly updated array
router.put('/moveBulkItems/:aisleName', auth, async (req, res) => {
    try {

        let updateItems = await Item.updateMany(
            { aisle: { $eq: req.params.aisleName } },
            { $set: { "aisle": req.params.aisleName } }
        );

        return res.send(updateItems);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

// delete bulk group items
// return newly added bulk items with its id's
router.delete('/deleteBulkItemsByAisle/:listId/:aisleName', auth, async (req, res) => {
    try {

        let newlist = await Item.deleteMany({ "listId": req.params.listId, "aisle": req.params.aisleName });

        return res.send(newlist);

    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router