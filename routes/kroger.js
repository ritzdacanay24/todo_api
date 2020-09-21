const express = require('express');
const router = express.Router();
var request = require('request');
const tokenService = require('./kroger_auth/token-service');
const config = require('config');

//set cookie
router.get('/callback', async (req, res) => {

    let code = req.query.code;
    let token = await tokenService.getByAuth(code);

    res.cookie('_accToken', token.access_token);
    res.cookie('_refToken', token.refresh_token);

    // Redirect user back to browser page (index.html)
    res.redirect('http://localhost:3000/ToDo/MyList');
    return res.send();

})

router.get('/clientCredentials', async (req, res) => {

    let token = await tokenService.getByClientCredentials();
    return res.send(token);

})

//set cookie
router.get('/refreshCookie', async (req, res) => {
    let token = await tokenService.getByRefresh(req.headers.reftoken);
    return res.send(token);
})

//search for groccery item
router.get('/:itemName/:locationId/:start', async function (req, res) {
    let itemName = req.params.itemName;
    let locationId = req.params.locationId;
    let start = req.params.start;
    let accToken = false;
    if (req.headers.authorization) {
        accToken = req.headers.authorization.split(' ')[1];
    }else{
        return res.status(500).send("Unauthorized access");
    }

    request({
        method: 'GET',
        uri: `https://api.kroger.com/v1/products?filter.term=${itemName}&filter.locationId=${locationId}&filter.limit=50&filter.start=${start}`,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${accToken}`
        }
    }, function (error, response, body) {
        res.json(JSON.parse(body));
    })
});

//get details of grocery item by id
router.get('/detail/:productId/:locationId', function (req, res) {
    let productId = req.params.productId;
    let locationId = req.params.locationId;
    let accToken = req.headers.authorization.split(' ')[1];

    request({
        method: 'GET',
        uri: `https://api.kroger.com/v1/products/${productId}?filter.locationId=${locationId}`,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${accToken}`
        }
    }, function (error, response, body) {
        res.json(JSON.parse(body));
    })
});

//search location to pull groccery items.
router.get('/location/:locationId', function (req, res) {
    let locationId = req.params.locationId;
    let accToken = req.headers.authorization.split(' ')[1];

    request({
        method: 'GET',
        uri: `https://api.kroger.com/v1/locations?filter.zipCode.near=${locationId}`,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${accToken}`
        }
    }, function (error, response, body) {
        res.json(JSON.parse(body));
    })
});


module.exports = router
