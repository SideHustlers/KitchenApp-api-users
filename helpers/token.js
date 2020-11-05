const fs = require('fs');
const jwt = require('jsonwebtoken');

const accessTokenPrivateKey = fs.readFileSync('keys/jwtRS512.key');
const refreshTokenPrivateKey = fs.readFileSync('keys/jwtRS512_refresh.key');

module.exports = {
  createTokens: function(user, roles) {
    var payload = {
      id: 123,
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "0",
        "x-hasura-allowed-roles": [
          "0",
          "100",
          "200",
          "300",
          "400"
        ],
        "x-hasura-user-id": "auth0|5db9de27b3065c0c6c4d890b"
      },
      iat: Math.floor(Date.now() / 1000) - 30,
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // Expire 1 hour from now
    }

    var refreshPayload = {
      id: 123,
      iat: Math.floor(Date.now() / 1000) - 30,
      exp: Math.floor(Date.now() / 1000) + (730 * (60 * 60)) // Expire one month from now
    };

    try {
      let accessToken = jwt.sign(payload, accessTokenPrivateKey, {algorithm: 'RS512'});
      let refreshToken = jwt.sign(refreshPayload, refreshTokenPrivateKey, {algorithm: 'RS512'});
      return [accessToken, refreshToken];
    } catch (err) {
      throw err;
    }
    
  }
}
