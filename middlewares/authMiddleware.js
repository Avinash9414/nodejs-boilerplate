const jwt = require('jsonwebtoken');        //sample middleware but functional.
const jwksClient = require('jwks-rsa');
const logger = require('../utils/logger');

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;

const client = jwksClient({
    jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`
});

const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
};

const verifyToken = (req, res, next) => {
    const accessToken = req.session.accessToken;

    if (!accessToken) return res.status(401).json({ error: 'Access Token Required' });

    jwt.verify(accessToken, getKey, {
        audience: clientId,
        issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`
    }, (err, decodedToken) => {
        if (err) {
            logger.error('Token verification failed:', err);
            return res.status(403).json({ error: 'Access Denied' });
        }
        req.decodedToken = decodedToken;
        next();
    });
};

const hasAccess = (requiredGroups) => {
    return (req, res, next) => {
        const decodedToken = req.decodedToken;

        if (!decodedToken || !decodedToken.groups) return res.status(403).json({ error: 'Access Denied' });

        for (let group of requiredGroups) {
            if (decodedToken.groups.includes(group)) {
                req.groups = decodedToken.groups;
                req.username = decodedToken.name;
                return next();
            }
        }

        return res.status(403).json({ error: 'Access Denied' });
    };
};

module.exports = {
    verifyToken,
    hasAccess
};
