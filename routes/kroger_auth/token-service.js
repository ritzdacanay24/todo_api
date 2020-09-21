const buffer = require('buffer');
const fetch = require("node-fetch");

// Parameters imported from .config file
const config = require('config');
const clientId = config.kroger.clientId;
const clientSecret = config.kroger.clientSecret;
const redirectUrl = config.kroger.redirectUrl;
const baseUrl = config.kroger.baseUrl;

// Get token by authorization code (getByAuth)
// Send user to kroger auth page to retrive refresh token and auth code. 
// this also lets the user create a kroger account. 
// If you create kroger account, we can get the user profile information too. How cool!!!
const getByAuth = async (code) => {

    const body = `grant_type=authorization_code&code=${encodeURIComponent(
        code
    )}&redirect_uri=${encodeURIComponent(redirectUrl)}`;

    return await get(body);
}

// Get token if you want to validate by user credentials
// For example, once the user logs into the grocery todo application. 
const getByClientCredentials = async () => {
    const body = `grant_type=client_credentials&scope=product.compact`;
    return await get(body);
}

// Get token using refresh token
const getByRefresh = async (refreshToken) => {
    const body =
        `grant_type=refresh_token&` +
        `refresh_token=${encodeURIComponent(refreshToken)}`;
    return await get(body);
}

const get = async (body) => {
    // ClientId and ClientSecret (stored in config file)

    const encoded = buffer.Buffer.from(`${clientId}:${clientSecret}`, `ascii`);

    // ClientId and clientSecret must be encoded
    const authorization = "Basic " + encoded.toString("base64");
    // Base URL (https://api.kroger.com/v1/connect/oauth2)
    // Version/Endpoint (/v1/token)
    const tokenUrl = `${baseUrl}token`;

    // token request
    try {

        let tokenResponse = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "User-Agent": "",
                Authorization: authorization,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
        });

        // Return json object
        return await tokenResponse.json();
    } catch (e) {
        return e
    }
}

exports.getByAuth = getByAuth;
exports.get = get; 
exports.getByRefresh = getByRefresh;
exports.getByClientCredentials = getByClientCredentials;