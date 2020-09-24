const { Support } = require('../models/support');
const express = require('express');
const router = express.Router();
const { sendEmail } = require('./sendEmail');

//create support ticket
router.post('/', async (req, res) => {
    try {

        let support = new Support({
            fullName: req.body.fullName,
            email: req.body.email,
            comment: req.body.comment
        })

        let results = await support.save();

        let to = 'ritzdacanay24@yahoo.com';
        let from = req.body.email;
        let mailOptions = {
            from: from,
            to: to,
            subject: 'Support ticket created',
            html: `
                <div>
                    <p>Hello Team, </p> <br>
                    <p>Ticket created by ${req.body.fullName} <p>
                    <p>Email: ${req.body.email}<p>
                    <p>Comment description below: <p>
                    <p>${req.body.comment}</p>
                    <p>Ref: ${results._id}</p>
                </div>
            `
        }

        sendEmail(mailOptions)

        return res.send({ message: "Successfully submitted" });
    }

    catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`)
    }
})


module.exports = router
