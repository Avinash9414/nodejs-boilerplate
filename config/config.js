require('dotenv').config();

module.exports = {
    tenantId: process.env.TENANT_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    tokenEndpoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
    sessionSecret: process.env.SESSION_SECRET,
    port: process.env.PORT || 3000,
    scopes: process.env.SCOPES,
};
