const expressJwt = require('express-jwt');
const userService = require('../service/user.service');
var propertiesReader = require('properties-reader');
var properties = process.env.ENV_NODE=="product"?propertiesReader('properties.product.file'):propertiesReader('properties.dev.file');
module.exports = jwt;

function jwt() {
    const secret = properties.get('server.host.secret');
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/models',
            '/mails/forget/',
            '/users/tokens/auth',
            '/users/passwords/restore'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};